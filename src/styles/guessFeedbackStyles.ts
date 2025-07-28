import { StyleSheet } from "react-native"
import { colors, responsive, spacing, typography } from "./global"

export const guessFeedbackStyles = StyleSheet.create({
  container: {
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: responsive.scale(8),
    marginVertical: spacing.small,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    alignSelf: "center",
  },
  correct: {
    backgroundColor: colors.quinary,
  },
  incorrect: {
    backgroundColor: colors.quaternary,
  },
  text: {
    ...typography.bodyText,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
  },
})
