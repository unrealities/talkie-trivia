import { StyleSheet } from "react-native"
import { responsive, spacing, getTypography } from "./global"

export const getHistoryDetailModalStyles = (colors: any) => {
  const typography = getTypography(colors)
  return StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      minHeight: responsive.scale(300),
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.large,
      minHeight: responsive.scale(300),
    },
    errorText: {
      ...typography.bodyText,
      color: colors.error,
      textAlign: "center",
    },
    historyGuessesTitle: {
      ...typography.heading2,
      fontSize: responsive.responsiveFontSize(20),
      textAlign: "center",
      marginTop: spacing.large,
      marginBottom: spacing.medium,
      color: colors.textPrimary,
    },
  })
}
