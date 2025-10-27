import { StyleSheet } from "react-native"
import { responsive } from "./global"

export const getErrorBoundaryStyles = (colors: any) =>
  StyleSheet.create({
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: responsive.scale(20),
    },
    titleText: {
      fontSize: responsive.responsiveFontSize(20),
      fontFamily: "Arvo-Bold",
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: responsive.scale(20),
    },
    messageText: {
      fontSize: responsive.responsiveFontSize(16),
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: responsive.scale(30),
    },
    errorDetails: {
      marginTop: responsive.scale(30),
      fontSize: responsive.responsiveFontSize(12),
      color: colors.textSecondary,
    },
  })
