import { StyleSheet, Dimensions } from "react-native"
import { colors, responsive } from "./global"

const { width } = Dimensions.get("window")

export const guessesStyles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: responsive.scale(90),
    paddingBottom: responsive.scale(10),
    paddingTop: responsive.scale(10),
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
    fontSize: responsive.responsiveFontSize(14),
    paddingRight: responsive.scale(20),
    textAlign: "right",
  },
  guess: {
    color: colors.secondary,
    flex: 3,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    minHeight: responsive.scale(18),
    textAlign: "left",
  },
})
