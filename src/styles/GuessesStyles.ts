import { StyleSheet } from "react-native"
import { colors } from "../styles/global"

export const guessesStyles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 90,
    paddingBottom: 10,
    paddingTop: 10,
  },
  guessContainer: {
    alignContent: "flex-start",
    flex: 1,
    flexDirection: "row",
    minHeight: 18,
    textAlign: "left",
    width: 300,
  },
  guessNumber: {
    color: colors.primary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: 14,
    maxWidth: 40,
    paddingRight: 20,
    textAlign: "right",
  },
  guess: {
    color: colors.secondary,
    flex: 3,
    fontFamily: "Arvo-Regular",
    fontSize: 14,
    minHeight: 18,
    textAlign: "left",
  },
})
