import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const guessesStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
    minHeight: responsive.scale(90),
    paddingBottom: responsive.scale(15),
    paddingTop: responsive.scale(15),
  },
  guessContainer: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsive.scale(8),
    paddingVertical: responsive.scale(6),
    paddingHorizontal: responsive.scale(8),
    borderRadius: responsive.scale(5),
    backgroundColor: colors.grey,
  },
  guessNumber: {
    color: colors.lightGrey,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(14),
    paddingRight: responsive.scale(10),
  },
  guess: {
    color: colors.secondary,
    flex: 1,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(16),
    minHeight: responsive.scale(20),
    textAlign: "left",
    marginLeft: responsive.scale(10),
  },
  guessSmall: {
    fontSize: responsive.responsiveFontSize(14),
    letterSpacing: -0.5,
  },
})
