import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const genresStyles = StyleSheet.create({
  genreContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.quaternary,
    borderRadius: responsive.scale(8),
    margin: responsive.scale(6),
    maxHeight: responsive.scale(44),
    minHeight: responsive.scale(26),
    minWidth: responsive.scale(80),
    maxWidth: responsive.scale(220),
    padding: responsive.scale(6),
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: responsive.scale(10),
  },
  genreText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(12),
    textAlign: "center",
  },
  noGenresText: {
    color: colors.secondary,
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(12),
    textAlign: "center",
    marginVertical: responsive.scale(10),
  },
})
