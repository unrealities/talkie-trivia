import { playerConverter } from "../../../../src/utils/firestore/converters/player"
import Player from "../../../../src/models/player"

describe("Firestore Converter: Player", () => {
  const mockPlayer = new Player("user-123", "Test User")

  describe("toFirestore", () => {
    it("should correctly convert Player model to Firestore object", () => {
      const result = playerConverter.toFirestore(mockPlayer)
      expect(result).toEqual({
        id: "user-123",
        name: "Test User",
      })
    })
  })

  describe("fromFirestore", () => {
    it("should correctly convert Firestore data to Player model", () => {
      const snapshot = {
        data: () => ({
          id: "user-123",
          name: "Test User",
        }),
      }

      // @ts-ignore
      const result = playerConverter.fromFirestore(snapshot, {})
      // The converter returns a plain object that conforms to the Player interface
      expect(result).toEqual(
        expect.objectContaining({
          id: "user-123",
          name: "Test User",
        })
      )
    })
  })
})
