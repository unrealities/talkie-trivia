import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const guessesStyles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: responsive.scale(150),
    paddingBottom: responsive.scale(10),
    paddingTop: responsive.scale(10),
    width: "100%",
  },
  guessRow: {
    overflow: "hidden",
    borderRadius: responsive.scale(4),
    marginTop: responsive.scale(4),
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
    alignSelf: "stretch",
    flexDirection: "row",
    paddingHorizontal: responsive.scale(8),
    paddingVertical: responsive.scale(8),
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
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey,
    borderRadius: responsive.scale(4),
    paddingHorizontal: responsive.scale(8),
    paddingVertical: responsive.scale(8),
    marginTop: responsive.scale(4),
    width: "100%",
  },
  skeletonTextContainer: {
    backgroundColor: "#444",
    flex: 1,
    borderRadius: responsive.scale(4),
    overflow: "hidden",
  },
  skeletonText: {
    height: responsive.scale(16),
    width: "100%",
  },
})
