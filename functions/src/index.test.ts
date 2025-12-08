import * as fft from "firebase-functions-test"

// 1. Create mock objects that will be returned by the factory
const mockTransaction = {
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
}

const mockFirestoreInstance = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  runTransaction: jest.fn(async (callback) => {
    return callback(mockTransaction)
  }),
}

// 2. Mock firebase-admin
jest.mock("firebase-admin", () => {
  return {
    initializeApp: jest.fn(),
    firestore: Object.assign(
      jest.fn(() => mockFirestoreInstance),
      {
        FieldValue: {
          serverTimestamp: jest.fn(() => "MOCK_TIMESTAMP"),
        },
      }
    ),
  }
})

// 3. Import function AFTER mocks are set up
import { submitGameResult } from "./index"

const test = fft()

describe("Cloud Function: submitGameResult", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    test.cleanup()
  })

  const mockContext = {
    auth: {
      uid: "user-123",
      token: "mock-token",
    },
  }

  const mockGame = {
    id: "game-1",
    playerID: "user-123",
    correctAnswer: true,
    difficulty: "LEVEL_3",
    guesses: [{}, {}], // 2 guesses
    guessesMax: 5,
    startDate: "2023-01-01",
    triviaItem: {
      id: 101,
      title: "Test Movie",
      posterPath: "/path.jpg",
    },
  }

  it("should throw error if user is unauthenticated", async () => {
    const wrapped = test.wrap(submitGameResult)
    // @ts-ignore
    await expect(wrapped({ playerGame: mockGame }, {})).rejects.toThrow(
      "The function must be called while authenticated."
    )
  })

  it("should throw error if playerID does not match auth uid", async () => {
    const wrapped = test.wrap(submitGameResult)
    const badGame = { ...mockGame, playerID: "other-user" }
    // @ts-ignore
    await expect(wrapped({ playerGame: badGame }, mockContext)).rejects.toThrow(
      "Invalid game data ownership."
    )
  })

  it("should successfully process a win and update stats", async () => {
    const wrapped = test.wrap(submitGameResult)

    // Mock existing stats
    mockTransaction.get.mockResolvedValue({
      exists: true,
      data: () => ({
        id: "user-123",
        currentStreak: 2,
        maxStreak: 5,
        games: 10,
        wins: [0, 0, 0, 0, 0],
        allTimeScore: 5000,
      }),
    })

    // @ts-ignore
    const result = await wrapped({ playerGame: mockGame }, mockContext)

    expect(result.success).toBe(true)
    expect(result.score).toBeGreaterThan(0)

    // Verify DB updates
    expect(mockFirestoreInstance.runTransaction).toHaveBeenCalled()

    // Check Stats Update logic
    const statsUpdateCall = mockTransaction.set.mock.calls.find(
      (call: any) => call[1].id === "user-123"
    )
    const updatedStats = statsUpdateCall[1]

    expect(updatedStats.games).toBe(11) // Incremented
    expect(updatedStats.currentStreak).toBe(3) // Incremented
    expect(updatedStats.allTimeScore).toBe(5000 + result.score)
  })

  it("should reset streak on loss", async () => {
    const wrapped = test.wrap(submitGameResult)
    const lossGame = { ...mockGame, correctAnswer: false }

    mockTransaction.get.mockResolvedValue({
      exists: true,
      data: () => ({
        id: "user-123",
        currentStreak: 5,
        games: 10,
        allTimeScore: 5000,
      }),
    })

    // @ts-ignore
    await wrapped({ playerGame: lossGame }, mockContext)

    const statsUpdateCall = mockTransaction.set.mock.calls.find(
      (call: any) => call[1].id === "user-123"
    )
    const updatedStats = statsUpdateCall[1]

    expect(updatedStats.currentStreak).toBe(0) // Reset
    expect(updatedStats.games).toBe(11)
  })

  it("should create default stats if they do not exist", async () => {
    const wrapped = test.wrap(submitGameResult)

    // Mock missing stats doc
    mockTransaction.get.mockResolvedValue({ exists: false })

    // @ts-ignore
    await wrapped({ playerGame: mockGame }, mockContext)

    const statsUpdateCall = mockTransaction.set.mock.calls.find(
      (call: any) => call[1].id === "user-123"
    )
    const updatedStats = statsUpdateCall[1]

    expect(updatedStats).toBeDefined()
    expect(updatedStats.games).toBe(1)
    expect(updatedStats.currentStreak).toBe(1)
  })
})
