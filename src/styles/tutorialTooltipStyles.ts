import { StyleSheet } from "react-native"
import { responsive, spacing, shadows, getButtonStyles } from "./global"

export const getTutorialTooltipStyles = (colors: any) => {
  const buttonStyles = getButtonStyles(colors)

  return StyleSheet.create({
    container: {
      position: "absolute",
      zIndex: 100,
      alignItems: "center",
      width: "90%",
      alignSelf: "center",
      ...shadows.medium,
    },
    tooltipBox: {
      backgroundColor: colors.tertiary,
      borderRadius: responsive.scale(8),
      padding: spacing.medium,
      width: "100%",
    },
    text: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(15),
      color: colors.background,
      lineHeight: responsive.responsiveFontSize(21),
      textAlign: "center",
      marginBottom: spacing.medium,
    },
    button: {
      ...buttonStyles.base,
      backgroundColor: colors.background,
      alignSelf: "center",
      paddingHorizontal: spacing.large,
    },
    buttonText: {
      ...buttonStyles.text,
      fontSize: responsive.responsiveFontSize(14),
      color: colors.tertiary,
    },
    pointer: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderStyle: "solid",
      borderLeftWidth: responsive.scale(10),
      borderRightWidth: responsive.scale(10),
      borderBottomWidth: responsive.scale(10),
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: colors.tertiary,
      transform: [{ rotate: "180deg" }],
    },
  })
}
