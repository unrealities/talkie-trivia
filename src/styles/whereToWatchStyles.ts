import { StyleSheet } from "react-native"
import { responsive, spacing } from "./global"

export const getWhereToWatchStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      padding: spacing.medium,
      marginTop: spacing.large,
      backgroundColor: colors.background,
      borderRadius: responsive.scale(8),
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(16),
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: spacing.medium,
    },
    providersContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: spacing.small,
    },
    provider: {
      alignItems: "center",
    },
    providerText: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(10),
      color: colors.textSecondary,
      marginTop: spacing.extraSmall,
    },
    disclaimer: {
      fontFamily: "Arvo-Italic",
      fontSize: responsive.responsiveFontSize(10),
      color: colors.textDisabled,
      textAlign: "center",
      marginTop: spacing.small,
    },
  })
