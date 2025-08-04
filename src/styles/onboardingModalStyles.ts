import { StyleSheet } from "react-native"
import { responsive, spacing } from "./global"

export const getOnboardingModalStyles = (colors: any) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalView: {
      backgroundColor: colors.background,
      borderRadius: responsive.scale(15),
      padding: responsive.scale(20),
      width: "90%",
      maxWidth: responsive.scale(450),
      alignItems: "center",
    },
    title: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(24),
      color: colors.primary,
      marginBottom: spacing.small,
    },
    subtitle: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(18),
      color: colors.textPrimary,
      marginBottom: spacing.large,
    },
    stepsContainer: {
      width: "100%",
      marginBottom: spacing.large,
    },
    stepRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.medium,
    },
    icon: {
      marginRight: spacing.medium,
      width: 24,
      textAlign: "center",
    },
    stepText: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(16),
      color: colors.textSecondary,
      flex: 1,
      lineHeight: responsive.responsiveFontSize(22),
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: responsive.scale(8),
      paddingVertical: responsive.scale(12),
      paddingHorizontal: responsive.scale(30),
      elevation: 2,
    },
    buttonText: {
      color: colors.background,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(16),
      textAlign: "center",
    },
  })
