import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const guessesStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: responsive.scale(10),
    marginBottom: responsive.scale(15),
    minHeight: responsive.scale(70),
    paddingBottom: responsive.scale(10),
    paddingTop: responsive.scale(10),
    width: "95%",
    alignSelf: "center",
  },
  guess: {
    color: colors.secondary,
    flex: 1,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    lineHeight: responsive.responsiveFontSize(18),
    marginLeft: responsive.scale(8),
    minHeight: responsive.scale(16),
    textAlign: "left",
  },
  guessContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.grey,
    borderRadius: responsive.scale(5),
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: responsive.scale(4),
    paddingHorizontal: responsive.scale(8),
    paddingVertical: responsive.scale(6),
    width: "100%",
  },
  guessNumber: {
    color: colors.lightGrey,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(12),
    paddingRight: responsive.scale(8),
  },
  guessSmall: {
    fontSize: responsive.responsiveFontSize(13),
    letterSpacing: -0.25,
  },
})
