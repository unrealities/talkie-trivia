import { gameService } from "../../src/services/gameService"
import { doc, getDoc } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
import { defaultPlayerGame, defaultPlayerStats } from "../../src/models/default"
import Player from "../../src/models/player"

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

  describe("submitGameResult", () => {
    it("should call the cloud function with correctly formatted payload", async () => {
      const mockCallable = jest
        .fn()
        .mockResolvedValue({ data: { success: true } })
      ;(getFunctions as jest.Mock).mockReturnValue({})
      ;(httpsCallable as jest.Mock).mockReturnValue(mockCallable)

      const mockGame = {
        ...defaultPlayerGame,
        id: "g1",
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-01-01"),
      }

      await gameService.submitGameResult(mockGame)

      expect(httpsCallable).toHaveBeenCalledWith({}, "submitGameResult")
      expect(mockCallable).toHaveBeenCalledWith({
        playerGame: expect.objectContaining({
          id: "g1",
          // Dates should be converted to strings
          startDate: "2023-01-01T00:00:00.000Z",
          endDate: "2023-01-01T00:00:00.000Z",
        }),
      })
    })
  })

  describe("savePlayerProgress (Deprecated)", () => {
    it("should throw an error indicating deprecation", async () => {
      await expect(
        gameService.savePlayerProgress(defaultPlayerGame, defaultPlayerStats)
      ).rejects.toThrow("Client-side save is deprecated")
    })
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
  })

  describe("fetchOrCreatePlayerGame", () => {
    it("should return an existing game if found", async () => {
      const mockExistingGame = { ...defaultPlayerGame, id: "existing-id" }
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
    })
  })
})
