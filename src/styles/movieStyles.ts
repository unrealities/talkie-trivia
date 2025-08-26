import { StyleSheet } from "react-native"
import { responsive, spacing, shadows, getTypography } from "../styles/global"

export const getMovieStyles = (colors: any) => {
  const typography = getTypography(colors)

  return StyleSheet.create({
    container: {
      alignItems: "center",
      flexGrow: 1,
      width: "100%",
      maxWidth: responsive.scale(600),
      alignSelf: "center",
      marginBottom: spacing.extraLarge,
    },
    scrollContentContainer: {
      paddingBottom: spacing.extraLarge,
      paddingTop: spacing.large,
      alignItems: "center",
      flexGrow: 1,
    },
    disabledButton: {
      opacity: 0.6,
    },
    giveUpButton: {
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: colors.error,
      borderRadius: responsive.scale(10),
      padding: spacing.medium,
      width: "100%",
      ...shadows.light,
    },
    giveUpButtonText: {
      color: colors.textPrimary,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(16),
      textAlign: "center",
    },
    pressedButton: {
      transform: [{ translateY: 2 }],
      opacity: 0.8,
    },
    gameOverCard: {
      backgroundColor: colors.surface,
      borderRadius: responsive.scale(12),
      width: "100%",
      marginVertical: spacing.medium,
      ...shadows.medium,
      backfaceVisibility: "hidden",
      overflow: "hidden",
    },
    gameOverScrollView: {
      maxHeight: responsive.screenHeight * 0.5,
    },
    gameOverContentContainer: {
      padding: spacing.large,
      alignItems: "center",
    },
    gameOverResultTitle: {
      ...typography.heading2,
      color: colors.primary,
      textAlign: "center",
      marginBottom: spacing.extraSmall,
    },
    gameOverSubText: {
      ...typography.bodyText,
      color: colors.textSecondary,
      fontFamily: "Arvo-Italic",
      textAlign: "center",
      marginBottom: spacing.large,
    },
    fullOverviewContainer: {
      width: "100%",
      marginTop: spacing.extraLarge,
      padding: spacing.medium,
      backgroundColor: colors.background,
      borderRadius: responsive.scale(8),
    },
    fullOverviewTitle: {
      ...typography.bodyText,
      fontFamily: "Arvo-Bold",
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: spacing.small,
    },
    fullOverviewText: {
      ...typography.bodyText,
      color: colors.textPrimary,
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(14),
      lineHeight: responsive.responsiveFontSize(20),
    },
    gameOverButtonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingVertical: spacing.medium,
    },
    gameOverButton: {
      backgroundColor: colors.quinary,
      paddingVertical: spacing.small,
      paddingHorizontal: spacing.large,
      borderRadius: responsive.scale(8),
      ...shadows.light,
      width: "80%",
      alignItems: "center",
    },
    gameOverButtonText: {
      ...typography.bodyText,
      fontFamily: "Arvo-Bold",
      color: colors.background,
    },
    countdownContainer: {
      marginTop: spacing.large,
      padding: spacing.small,
      backgroundColor: colors.surface,
      borderRadius: responsive.scale(8),
    },
    countdownText: {
      ...typography.caption,
      fontFamily: "Arvo-Bold",
      color: colors.textSecondary,
      fontSize: responsive.responsiveFontSize(14),
    },
    personalizedMessageContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.medium,
      paddingVertical: spacing.small,
      marginTop: spacing.medium,
    },
    personalizedMessageText: {
      ...typography.caption,
      color: colors.tertiary,
      fontFamily: "Arvo-Bold",
      marginLeft: spacing.small,
      textAlign: "center",
    },
  })
}
