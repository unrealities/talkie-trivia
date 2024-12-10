import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const genresStyles = StyleSheet.create({
  genreContainer: {
    alignItems: "center",
    backgroundColor: colors.quaternary,
    borderRadius: responsive.scale(8),
    margin: responsive.scale(6),
    padding: responsive.scale(6),
    flexBasis: "28%",
    flexGrow: 1,
    flexShrink: 0,
    minHeight: responsive.scale(35),
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
