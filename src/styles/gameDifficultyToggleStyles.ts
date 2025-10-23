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
      paddingHorizontal: spacing.small,
      borderRadius: responsive.scale(10),
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
      width: responsive.scale(90),
      backgroundColor: colors.backgroundLight,
      borderRadius: responsive.scale(8),
      marginTop: spacing.extraSmall,
      ...shadows.medium,
      overflow: "hidden",
    },
    optionButton: {
      padding: spacing.small,
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
