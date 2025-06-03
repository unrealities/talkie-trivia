import { StyleSheet } from "react-native"
import { colors, responsive, spacing } from "./global"

export const cluesStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginVertical: spacing.small,
    minHeight: responsive.scale(220),
    paddingHorizontal: spacing.small,
    width: "100%",
    maxWidth: responsive.scale(400),
    alignSelf: "stretch",
  },
  countContainer: {
    alignSelf: "flex-end",
    marginBottom: responsive.scale(12),
    marginRight: spacing.extraLarge,
    marginTop: spacing.small,
  },
  mostRecentClue: {
    paddingHorizontal: spacing.extraSmall,
  },
  scrollView: {
    flexGrow: 1,
    marginBottom: spacing.large,
    width: "100%",
    alignSelf: "stretch",
  },
  scrollViewContent: {
    paddingVertical: spacing.large,
  },
  skeletonContainer: {
    paddingHorizontal: spacing.large,
    paddingTop: spacing.large,
  },
  skeletonLine: {
    backgroundColor: colors.quaternary,
    borderRadius: responsive.scale(4),
    height: responsive.scale(16),
    marginBottom: responsive.scale(12),
  },
  skeletonLineShort: {
    width: "60%",
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    lineHeight: responsive.responsiveFontSize(18),
    paddingBottom: spacing.extraSmall,
    flexWrap: "wrap",
  },
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.large,
    width: "100%",
  },
  wordCountText: {
    color: colors.primary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(10),
    textAlign: "right",
  },
})
