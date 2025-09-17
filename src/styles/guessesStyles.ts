import { StyleSheet, ViewStyle } from "react-native"
import { responsive, spacing, shadows } from "./global"

export const getGuessesStyles = (colors: any) => {
  const baseRow: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: responsive.scale(8),
    paddingHorizontal: spacing.medium,
    minHeight: responsive.scale(44),
    marginBottom: spacing.small,
  }

  return StyleSheet.create({
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
      position: "relative",
      overflow: "hidden",
      justifyContent: "flex-start",
    },
    guessNumber: {
      color: colors.textSecondary,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(14),
      marginRight: spacing.small,
    },
    guessIcon: {
      marginRight: spacing.medium,
      fontSize: responsive.responsiveFontSize(22),
    },
    guessTextContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      overflow: "hidden",
    },
    guessText: {
      flexShrink: 1,
      color: colors.textPrimary,
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(14),
      lineHeight: responsive.responsiveFontSize(18),
      marginRight: spacing.small,
    },
    guessHintContainer: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
    },
    guessHintIcon: {
      marginRight: spacing.extraSmall,
      fontSize: responsive.responsiveFontSize(14),
      opacity: 0.8,
    },
    guessHintText: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(12),
      color: colors.primary,
      flexShrink: 1,
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
    feedbackOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.tertiary,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.small,
      zIndex: 1,
    },
    feedbackText: {
      color: colors.background,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(14),
      textAlign: "center",
    },
  })
}
