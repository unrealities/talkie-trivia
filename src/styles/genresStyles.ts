import { StyleSheet } from "react-native"
import { colors } from "../styles/global"

export const genresStyles = StyleSheet.create({
  genreContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.quaternary,
    borderRadius: 8,
    margin: 6,
    maxHeight: 44,
    minHeight: 26,
    minWidth: 80,
    maxWidth: 220,
    padding: 6,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  genreText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    fontSize: 12,
    textAlign: "center",
  },
  noGenresText: {
    color: colors.secondary,
    fontFamily: "Arvo-Italic",
    fontSize: 12,
    textAlign: "center",
    marginVertical: 10,
  },
})
