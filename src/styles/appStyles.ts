import { StyleSheet, Platform } from "react-native"
import { responsive, spacing, shadows, getTypography } from "./global"

export const getAppStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      paddingHorizontal: responsive.scale(10),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      width: "100%",
    },
    messageText: {
      marginTop: responsive.scale(20),
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(16),
      color: colors.textSecondary,
      textAlign: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: responsive.scale(20),
    },
    errorText: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(18),
      color: colors.error,
      textAlign: "center",
      width: "80%",
    },
    profileContainer: {
      flex: 1,
    },
    profileContentContainer: {
      padding: spacing.medium,
      paddingTop:
        Platform.OS === "ios" ? responsive.scale(60) : responsive.scale(30),
      alignItems: "center",
      paddingBottom: spacing.extraLarge,
    },
    profileHeader: {
      alignItems: "center",
      marginBottom: spacing.large,
      paddingBottom: spacing.medium,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      width: "100%",
    },
    profileTitle: {
      ...getTypography(colors).heading2,
      color: colors.textPrimary,
    },
    profileSubtitle: {
      ...getTypography(colors).bodyText,
      color: colors.textSecondary,
      marginTop: spacing.extraSmall,
    },
    profileSection: {
      backgroundColor: colors.surface,
      borderRadius: responsive.scale(12),
      width: "100%",
      maxWidth: responsive.scale(500),
      marginBottom: spacing.large,
      ...shadows.light,
      overflow: "hidden",
    },
    profileSectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.medium,
      backgroundColor:
        colors.colorScheme === "dark"
          ? "rgba(255,255,255,0.05)"
          : "rgba(0,0,0,0.02)",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    profileSectionTitle: {
      ...getTypography(colors).heading2,
      fontSize: responsive.responsiveFontSize(18),
      color: colors.primary,
      marginLeft: spacing.small,
    },
    profileSectionContent: {
      padding: spacing.medium,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.medium,
    },
    signInPromptContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.large,
      backgroundColor: colors.surface,
      borderRadius: responsive.scale(12),
      width: "100%",
      maxWidth: responsive.scale(500),
      marginTop: responsive.scale(40),
    },
    signInPromptTitle: {
      ...getTypography(colors).heading2,
      color: colors.primary,
      marginTop: spacing.medium,
      marginBottom: spacing.small,
      textAlign: "center",
    },
    signInPromptText: {
      ...getTypography(colors).bodyText,
      textAlign: "center",
      marginBottom: spacing.large,
    },
  })
