import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const guessesStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
    minHeight: responsive.scale(90),
    paddingBottom: responsive.scale(10),
    paddingTop: responsive.scale(10),
  },
  guessContainer: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsive.scale(10),
  },
  guessNumber: {
    color: colors.primary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(14),
    paddingRight: responsive.scale(8),
  },
  guess: {
    color: colors.secondary,
    flex: 1,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    minHeight: responsive.scale(18),
    textAlign: "left",
    marginLeft: responsive.scale(8),
  },
  guessSmall: {
    fontSize: responsive.responsiveFontSize(12),
    letterSpacing: -0.5,
  }
})
