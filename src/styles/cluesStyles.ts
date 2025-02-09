import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const cluesStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginVertical: responsive.scale(15),
    paddingHorizontal: responsive.scale(20),
  },
  countContainer: {
    alignSelf: "flex-end",
    marginTop: responsive.scale(4),
    marginBottom: responsive.scale(8),
    marginRight: responsive.scale(20),
  },
  mostRecentClue: {
    fontFamily: "Arvo-Bold",
    backgroundColor: colors.quinary,
    paddingHorizontal: responsive.scale(10),
    paddingVertical: responsive.scale(6),
    borderRadius: responsive.scale(5),
    marginVertical: responsive.scale(4),
    color: colors.background,
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: responsive.scale(0),
    maxHeight: responsive.scale(300),
    marginBottom: responsive.scale(10),
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
    fontSize: responsive.responsiveFontSize(16),
    paddingBottom: responsive.scale(8),
    lineHeight: responsive.responsiveFontSize(22),
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
    fontSize: responsive.responsiveFontSize(10),
    textAlign: "right",
  },
})
