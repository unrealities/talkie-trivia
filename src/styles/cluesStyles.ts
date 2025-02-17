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
    marginBottom: responsive.scale(8),
    marginRight: responsive.scale(20),
    marginTop: responsive.scale(4),
  },
  mostRecentClue: {
    backgroundColor: colors.tertiary,
    color: colors.background,
    fontFamily: "Arvo-Bold",
    marginVertical: responsive.scale(4),
    paddingHorizontal: responsive.scale(2)
  },
  scrollView: {
    flexGrow: 1,
    marginBottom: responsive.scale(10),
    paddingHorizontal: responsive.scale(0),
    width: "100%",
  },
  scrollViewContent: {
    paddingVertical: responsive.scale(10),
  },
  skeletonContainer: {
    paddingHorizontal: responsive.scale(10),
    paddingTop: responsive.scale(10),
  },
  skeletonLine: {
    backgroundColor: colors.tertiary,
    borderRadius: responsive.scale(4),
    height: responsive.scale(16),
    marginBottom: responsive.scale(8),
  },
  skeletonLineShort: {
    width: "60%",
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    lineHeight: responsive.responsiveFontSize(16),
    paddingBottom: responsive.scale(4),
    flexWrap: "wrap",
  },
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: responsive.scale(10),
    width: "100%",
  },
  wordCountText: {
    color: colors.primary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(10),
    textAlign: "right",
  },
})
