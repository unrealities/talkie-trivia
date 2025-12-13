import { gameService } from "../../src/services/gameService"
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
import { defaultPlayerGame, defaultPlayerStats } from "../../src/models/default"
import Player from "../../src/models/player"
import Constants from "expo-constants"

// Mocks
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}))

jest.mock("firebase/functions", () => ({
  getFunctions: jest.fn(),
  httpsCallable: jest.fn(),
}))

jest.mock("../../src/utils/firestore/converters/playerGame", () => ({
  playerGameConverter: {},
}))
jest.mock("../../src/utils/firestore/converters/player", () => ({
  playerConverter: {},
}))
jest.mock("../../src/utils/firestore/converters/playerStats", () => ({
  playerStatsConverter: {},
}))
jest.mock("../../src/utils/firestore/converters/gameHistoryEntry", () => ({
  gameHistoryEntryConverter: {},
}))

describe("Service: gameService", () => {
  const mockPlayerId = "player-123"
  const mockDateId = "2023-01-01"
  const mockDocRef = { withConverter: jest.fn().mockReturnValue("mock-ref") }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
  })

  describe("ensurePlayerExists", () => {
    it("should return existing player if found", async () => {
      const existingPlayer = new Player(mockPlayerId, "Existing Name")
      ;(getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => existingPlayer,
      })

      const result = await gameService.ensurePlayerExists(
        mockPlayerId,
        "New Name"
      )
      expect(result).toEqual(existingPlayer)
    })

    it("should create new player if not found", async () => {
      ;(getDoc as jest.Mock).mockResolvedValue({ exists: () => false })

      const result = await gameService.ensurePlayerExists(
        mockPlayerId,
        "New Name"
      )

      expect(result.id).toBe(mockPlayerId)
      expect(result.name).toBe("New Name")
      expect(setDoc).toHaveBeenCalled()
    })
  })

  describe("fetchOrCreatePlayerGame", () => {
    it("should return an existing game if found", async () => {
      const mockExistingGame = {
        ...defaultPlayerGame,
        id: "existing-id",
        guessesMax: 3,
      }
      ;(getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockExistingGame,
      })

      const result = await gameService.fetchOrCreatePlayerGame(
        mockPlayerId,
        mockDateId,
        {} as any,
        5
      )
      expect(result.id).toBe("existing-id")
      expect(result.guessesMax).toBe(5)
    })

    it("should create a NEW game if document does not exist", async () => {
      ;(getDoc as jest.Mock).mockResolvedValue({ exists: () => false })

      await gameService.fetchOrCreatePlayerGame(
        mockPlayerId,
        mockDateId,
        { id: 99 } as any,
        5
      )

      expect(setDoc).toHaveBeenCalled()
      const savedData = (setDoc as jest.Mock).mock.calls[0][1]
      expect(savedData.playerID).toBe(mockPlayerId)
      expect(savedData.triviaItem.id).toBe(99)
    })
  })

  describe("fetchPlayerGameById", () => {
    it("should return null if game does not exist", async () => {
      ;(getDoc as jest.Mock).mockResolvedValue({ exists: () => false })
      const result = await gameService.fetchPlayerGameById("bad-id")
      expect(result).toBeNull()
    })

    it("should return data if game exists", async () => {
      ;(getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ id: "game-1" }),
      })
      const result = await gameService.fetchPlayerGameById("game-1")
      expect(result).toEqual({ id: "game-1" })
    })
  })

  describe("fetchOrCreatePlayerStats", () => {
    it("should return existing stats", async () => {
      ;(getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ ...defaultPlayerStats, games: 5 }),
      })
      const result = await gameService.fetchOrCreatePlayerStats(mockPlayerId)
      expect(result.games).toBe(5)
    })

    it("should create default stats if missing", async () => {
      ;(getDoc as jest.Mock).mockResolvedValue({ exists: () => false })
      const result = await gameService.fetchOrCreatePlayerStats(mockPlayerId)
      expect(result.hintsAvailable).toBe(3)
      expect(setDoc).toHaveBeenCalled()
    })
  })

  describe("submitGameResult", () => {
    it("should call the cloud function with formatted payload", async () => {
      const mockCallable = jest
        .fn()
        .mockResolvedValue({ data: { success: true } })
      ;(getFunctions as jest.Mock).mockReturnValue({})
      ;(httpsCallable as jest.Mock).mockReturnValue(mockCallable)

      const mockGame = {
        ...defaultPlayerGame,
        id: "g1",
        playerID: "p1",
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-01-01"),
      }

      await gameService.submitGameResult(mockGame)

      expect(httpsCallable).toHaveBeenCalledWith({}, "submitGameResult")
      // Check date serialization
      expect(mockCallable).toHaveBeenCalledWith({
        playerGame: expect.objectContaining({
          id: "g1",
          startDate: "2023-01-01T00:00:00.000Z",
        }),
      })
    })

    it("should skip network call in E2E mode", async () => {
      if (Constants.expoConfig && Constants.expoConfig.extra) {
        Constants.expoConfig.extra.isE2E = true
      } else {
        // @ts-ignore
        Constants.expoConfig = { extra: { isE2E: true } }
      }

      await gameService.submitGameResult({
        ...defaultPlayerGame,
        startDate: new Date(),
        endDate: new Date(),
      })

      // Verify httpsCallable was NOT called
      expect(httpsCallable).not.toHaveBeenCalled()

      // Reset
      if (Constants.expoConfig && Constants.expoConfig.extra) {
        Constants.expoConfig.extra.isE2E = false
      }
    })
  })

  describe("fetchGameHistory", () => {
    it("should return mapped data", async () => {
      ;(collection as jest.Mock).mockReturnValue(mockDocRef)
      const mockData = [{ id: 1 }, { id: 2 }]
      ;(getDocs as jest.Mock).mockResolvedValue({
        docs: mockData.map((d) => ({ data: () => d })),
      })

      const result = await gameService.fetchGameHistory(mockPlayerId)
      expect(result).toHaveLength(2)
    })
  })
})
