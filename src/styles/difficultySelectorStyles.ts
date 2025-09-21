import { StyleSheet } from "react-native"
import { responsive, spacing } from "./global"

export const getDifficultySelectorStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    labelContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(16),
      color: colors.textPrimary,
      marginLeft: spacing.small,
    },
    selectedOptionDisplay: {
      backgroundColor: colors.background,
      paddingVertical: spacing.extraSmall,
      paddingHorizontal: spacing.small,
      borderRadius: responsive.scale(6),
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedOptionTextDisplay: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(14),
      color: colors.textSecondary,
    },
    subtitle: {
      fontFamily: "Arvo-Italic",
      fontSize: responsive.responsiveFontSize(12),
      color: colors.textSecondary,
      marginTop: spacing.small,
      marginBottom: spacing.small,
      width: "100%",
      textAlign: "left",
    },
    optionsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      backgroundColor: colors.background,
      borderRadius: responsive.scale(8),
      padding: spacing.extraSmall,
      borderWidth: 1,
      borderColor: colors.border,
    },
    option: {
      paddingVertical: spacing.small,
      paddingHorizontal: spacing.medium,
      borderRadius: responsive.scale(6),
      margin: spacing.extraSmall,
      backgroundColor: colors.surface,
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
