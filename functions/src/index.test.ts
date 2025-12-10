import * as fft from "firebase-functions-test"

const test = fft({
  projectId: "talkie-trivia",
})

// --- HOISTED MOCKS SETUP ---
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

import { submitGameResult } from "./index"

describe("Cloud Function: submitGameResult", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    test.cleanup()
  })

  const mockAuth = {
    uid: "user-123",
    token: "mock-token",
  }

  const mockGame = {
    id: "game-1",
    playerID: "user-123",
    correctAnswer: true,
    difficulty: "LEVEL_3",
    guesses: [{}, {}],
    guessesMax: 5,
    startDate: "2023-01-01",
    triviaItem: {
      id: 101,
      title: "Test Movie",
      posterPath: "/path.jpg",
    },
  }

  // Helper to invoke the function safely
  // If .run exists (v2 specific), use it. Otherwise try direct call.
  const invokeFunction = async (data: any, auth: any) => {
    // @ts-ignore
    if (submitGameResult.run) {
      // @ts-ignore
      return submitGameResult.run({ data, auth })
    } else {
      // Fallback for some test environments where wrap works differently
      // But since wrap failed, we assume direct invocation logic here
      // This relies on internal implementation details if wrap fails
      // Let's try to mock the context if we can't use wrap
      throw new Error("Cannot invoke function: .run method missing")
    }
  }

  it("should throw error if user is unauthenticated", async () => {
    // @ts-ignore
    await expect(
      invokeFunction({ playerGame: mockGame }, undefined)
    ).rejects.toThrow("The function must be called while authenticated.")
  })

  it("should throw error if playerID does not match auth uid", async () => {
    const badGame = { ...mockGame, playerID: "other-user" }
    // @ts-ignore
    await expect(
      invokeFunction({ playerGame: badGame }, mockAuth)
    ).rejects.toThrow("Invalid game data ownership.")
  })

  it("should successfully process a win and update stats", async () => {
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

    const result = await invokeFunction({ playerGame: mockGame }, mockAuth)

    expect(result.success).toBe(true)
    expect(result.score).toBeGreaterThan(0)

    expect(mockFirestoreInstance.runTransaction).toHaveBeenCalled()

    const statsUpdateCall = mockTransaction.set.mock.calls.find(
      (call: any) => call[1].id === "user-123"
    )
    const updatedStats = statsUpdateCall[1]

    expect(updatedStats.games).toBe(11)
    expect(updatedStats.currentStreak).toBe(3)
    expect(updatedStats.allTimeScore).toBe(5000 + result.score)
  })

  it("should reset streak on loss", async () => {
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

    await invokeFunction({ playerGame: lossGame }, mockAuth)

    const statsUpdateCall = mockTransaction.set.mock.calls.find(
      (call: any) => call[1].id === "user-123"
    )
    const updatedStats = statsUpdateCall[1]

    expect(updatedStats.currentStreak).toBe(0)
    expect(updatedStats.games).toBe(11)
  })

  it("should create default stats if they do not exist", async () => {
    mockTransaction.get.mockResolvedValue({ exists: false })

    await invokeFunction({ playerGame: mockGame }, mockAuth)

    const statsUpdateCall = mockTransaction.set.mock.calls.find(
      (call: any) => call[1].id === "user-123"
    )
    const updatedStats = statsUpdateCall[1]

    expect(updatedStats).toBeDefined()
    expect(updatedStats.games).toBe(1)
    expect(updatedStats.currentStreak).toBe(1)
  })
})
