import { StyleSheet } from "react-native"
import { responsive, spacing, shadows, getTypography } from "./global"

export const getGuessFeedbackStyles = (colors: any) => {
  const typography = getTypography(colors)
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.small,
      paddingHorizontal: spacing.medium,
      borderRadius: responsive.scale(8),
      marginVertical: spacing.small,
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
      alignSelf: "center",
      ...shadows.light,
    },
    correct: {
      backgroundColor: colors.success,
    },
    incorrect: {
      backgroundColor: colors.error,
    },
    text: {
      ...typography.bodyText,
      fontFamily: "Arvo-Bold",
      textAlign: "center",
      color: colors.background,
    },
  })
}
