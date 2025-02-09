import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const genresStyles = StyleSheet.create({
  genreContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.quaternary,
    borderRadius: responsive.scale(10),
    margin: responsive.scale(5),
    padding: responsive.scale(8),
    flexBasis: "auto",
    flexGrow: 1,
    flexShrink: 1,
    minHeight: responsive.scale(30),
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: responsive.scale(15),
    paddingHorizontal: responsive.scale(10),
  },
  genreText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(14),
    textAlign: "center",
  },
  noGenresText: {
    color: colors.tertiary,
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(12),
    textAlign: "center",
    marginVertical: responsive.scale(8),
  },
})
