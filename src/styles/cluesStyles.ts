import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const cluesStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginVertical: responsive.scale(10),
  },
  countContainer: {
    alignSelf: "flex-end",
    marginTop: responsive.scale(8),
    marginBottom: responsive.scale(4),
  },
  mostRecentClue: {
    fontFamily: "Arvo-Bold",
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: responsive.scale(10),
    maxHeight: responsive.scale(200),
    marginBottom: responsive.scale(8),
  },
  skeletonContainer: {
    paddingHorizontal: responsive.scale(10),
    paddingTop: responsive.scale(10),
  },
  skeletonLine: {
    backgroundColor: colors.tertiary,
    height: responsive.scale(16),
    marginBottom: responsive.scale(8),
    borderRadius: responsive.scale(4),
  },
  skeletonLineShort: {
    width: "60%",
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(12),
    paddingBottom: responsive.scale(8),
    lineHeight: responsive.responsiveFontSize(16),
  },
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    paddingHorizontal: responsive.scale(10),
  },
  wordCountText: {
    color: colors.primary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(8),
    textAlign: "right",
  },
})
