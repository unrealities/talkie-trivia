/**
 * Normalizes a string by converting accented characters to their base equivalent
 * (e.g., 'é' becomes 'e', 'ü' becomes 'u').
 * Used primarily for making searches case and diacritic-insensitive.
 * @param str The string to normalize.
 * @returns The normalized string.
 */
export const normalizeSearchString = (str: string): string => {
  if (!str) return ""
  // Uses NFD (Normalization Form D) to decompose characters into base and diacritics,
  // then uses a regex to remove the diacritics (Unicode range P)
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
