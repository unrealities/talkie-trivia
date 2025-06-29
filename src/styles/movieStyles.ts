import { StyleSheet, Dimensions } from "react-native"
import { responsive, colors, spacing } from "../styles/global"

const { width, height } = Dimensions.get("window")

export const movieStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
    width: "100%",
    maxWidth: responsive.scale(500),
    alignSelf: "center",
    marginBottom: spacing.extraLarge,
  },
  disabledButton: {
    opacity: 0.6,
  },
  feedbackContainer: {
    alignItems: "center",
    backgroundColor: colors.quinary,
    borderRadius: responsive.scale(8),
    marginBottom: spacing.large,
    marginTop: spacing.large,
    padding: spacing.medium,
    width: "100%",
  },
  feedbackText: {
    color: colors.background,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    textAlign: "center",
  },
  giveUpButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.quaternary,
    borderColor: colors.quaternary,
    borderRadius: responsive.scale(10),
    borderWidth: 2,
    elevation: 0,
    justifyContent: "center",
    padding: spacing.medium,
    width: "100%",
  },
  giveUpButtonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    textAlign: "center",
  },
  pressedButton: {
    opacity: 0.8,
  },
  scrollContentContainer: {
    paddingBottom: spacing.extraLarge,
    paddingTop: spacing.extraLarge,
    alignItems: "center",
    flexGrow: 1,
  },
})

export default movieStyles
