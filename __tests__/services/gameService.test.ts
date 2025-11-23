import { gameService } from "../../src/services/gameService"
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore"
import { defaultPlayerGame, defaultPlayerStats } from "../../src/models/default"
import Player from "../../src/models/player"

// Deep mock of Firestore
const mockBatch = {
  set: jest.fn(),
  commit: jest.fn(),
}

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
  writeBatch: jest.fn(() => mockBatch),
}))

// Mock Converters
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
      expect(setDoc).not.toHaveBeenCalled()
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
      expect(result.guessesMax).toBe(5) // Should update guessesMax
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

  describe("savePlayerProgress", () => {
    it("should use batch to save game, stats, and history", async () => {
      const mockGame = { ...defaultPlayerGame, id: "g1", playerID: "p1" }
      const mockStats = { ...defaultPlayerStats }
      const mockHistory = { dateId: "2023-01-01" } as any

      await gameService.savePlayerProgress(mockGame, mockStats, mockHistory)

      expect(writeBatch).toHaveBeenCalled()
      // 3 sets: stats, game, history
      expect(mockBatch.set).toHaveBeenCalledTimes(3)
      expect(mockBatch.commit).toHaveBeenCalled()
    })

    it("should throw error if playerID is missing", async () => {
      const invalidGame = { ...defaultPlayerGame, playerID: "" }
      await expect(
        gameService.savePlayerProgress(invalidGame, defaultPlayerStats)
      ).rejects.toThrow("Player ID is missing")
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
