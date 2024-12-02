import { StyleSheet, Dimensions } from "react-native"
import { colors } from "./global"

const { width } = Dimensions.get('window')

export const guessesStyles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 90,
    paddingBottom: 10,
    paddingTop: 10,
  },
  guessContainer: {
    flexDirection: "row",
    width: width * 0.4,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  guessNumber: {
    color: colors.primary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: Math.min(14, width * 0.1), 
    paddingRight: 20,
    textAlign: "right",
  },
  guess: {
    color: colors.secondary,
    flex: 3,
    fontFamily: "Arvo-Regular",
    fontSize: Math.min(14, width * 0.1),
    minHeight: 18,
    textAlign: "left",
  },
})
