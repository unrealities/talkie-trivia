import { normalizeSearchString } from "../src/utils/stringUtils"

describe("Utils: stringUtils", () => {
  describe("normalizeSearchString", () => {
    it("should return empty string for null or undefined input", () => {
      // @ts-ignore
      expect(normalizeSearchString(null)).toBe("")
      // @ts-ignore
      expect(normalizeSearchString(undefined)).toBe("")
    })

    it("should remove diacritics (accents)", () => {
      expect(normalizeSearchString("Amélie")).toBe("Amelie")
      expect(normalizeSearchString("Crème Brûlée")).toBe("Creme Brulee")
      expect(normalizeSearchString("Ñu")).toBe("Nu")
    })

    it("should handle standard ascii strings unchanged", () => {
      expect(normalizeSearchString("Star Wars")).toBe("Star Wars")
    })

    it("should handle mixed casing and special characters correctly", () => {
      // Function only normalizes NFD forms, it doesn't strip non-alphanumeric or lowercase
      // based on the implementation in source.
      expect(normalizeSearchString("WALL·E")).toBe("WALL·E")
    })
  })
})
