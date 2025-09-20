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
        Platform.OS === "ios" ? responsive.scale(50) : responsive.scale(20),
      alignItems: "center",
    },
    profileCard: {
      backgroundColor: colors.surface,
      borderRadius: responsive.scale(12),
      padding: spacing.medium,
      width: "100%",
      maxWidth: responsive.scale(500),
      marginBottom: spacing.large,
      ...shadows.light,
    },
    profileCardTitle: {
      ...getTypography(colors).heading2,
      fontSize: responsive.responsiveFontSize(20),
      color: colors.primary,
      marginBottom: spacing.medium,
      textAlign: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: spacing.small,
    },
  })
