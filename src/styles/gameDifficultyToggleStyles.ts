import { StyleSheet } from "react-native"
import { responsive, spacing, shadows } from "./global"

export const getGameDifficultyToggleStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      marginVertical: spacing.small,
      zIndex: 10,
    },
    toggleButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      paddingVertical: spacing.small,
      paddingHorizontal: spacing.medium,
      borderRadius: responsive.scale(20),
      ...shadows.light,
    },
    toggleButtonText: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(14),
      color: colors.textPrimary,
      marginRight: spacing.small,
    },
    dropdownContainer: {
      position: "absolute",
      top: "100%",
      width: responsive.scale(200),
      backgroundColor: colors.background,
      borderRadius: responsive.scale(8),
      marginTop: spacing.small,
      ...shadows.medium,
      overflow: "hidden",
    },
    optionButton: {
      padding: spacing.medium,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionText: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(16),
      color: colors.textPrimary,
    },
    selectedOptionText: {
      fontFamily: "Arvo-Bold",
      color: colors.primary,
    },
    disabledOption: {
      backgroundColor: colors.backgroundLight,
    },
    disabledText: {
      color: colors.textDisabled,
    },
  })
