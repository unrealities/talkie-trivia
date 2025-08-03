import { StyleSheet, ViewStyle } from "react-native"
import { colors, responsive, spacing, shadows } from "./global"

const baseRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  borderRadius: responsive.scale(8),
  paddingHorizontal: spacing.medium,
  minHeight: responsive.scale(44),
  marginBottom: spacing.small,
}

export const guessesStyles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: spacing.small,
  },
  emptyGuessTile: {
    ...baseRow,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  guessTile: {
    ...baseRow,
    backgroundColor: colors.surface,
    paddingVertical: spacing.small,
    ...shadows.light,
  },
  guessNumber: {
    color: colors.textSecondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(14),
    marginRight: spacing.medium,
  },
  guessText: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    lineHeight: responsive.responsiveFontSize(18),
  },
  guessTextSmall: {
    fontSize: responsive.responsiveFontSize(12),
  },
  guessIcon: {
    marginLeft: spacing.small,
    fontSize: responsive.responsiveFontSize(22),
  },
  skeletonRow: {
    ...baseRow,
    backgroundColor: colors.surface,
    paddingVertical: spacing.small,
  },
  skeletonTextContainer: {
    backgroundColor: colors.border,
    flex: 1,
    borderRadius: responsive.scale(4),
    overflow: "hidden",
  },
  skeletonText: {
    height: responsive.scale(16),
    width: "100%",
  },
})
