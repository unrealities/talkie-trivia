import { StyleSheet } from "react-native"
import { responsive, spacing } from "./global"

export const getDifficultySelectorStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginVertical: spacing.large,
      alignItems: "center",
    },
    title: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(20),
      color: colors.primary,
      marginBottom: spacing.small,
    },
    subtitle: {
      fontFamily: "Arvo-Italic",
      fontSize: responsive.responsiveFontSize(12),
      color: colors.textSecondary,
      marginBottom: spacing.medium,
    },
    optionsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderRadius: responsive.scale(8),
      padding: spacing.extraSmall,
    },
    option: {
      paddingVertical: spacing.small,
      paddingHorizontal: spacing.medium,
      borderRadius: responsive.scale(6),
      margin: spacing.extraSmall,
    },
    selectedOption: {
      backgroundColor: colors.primary,
    },
    optionText: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(14),
      color: colors.textPrimary,
    },
    selectedOptionText: {
      fontFamily: "Arvo-Bold",
      color: colors.background,
    },
    descriptionContainer: {
      marginTop: spacing.medium,
      minHeight: responsive.scale(60),
      paddingHorizontal: spacing.small,
      justifyContent: "center",
    },
    descriptionText: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(12),
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: responsive.responsiveFontSize(18),
    },
  })
