import { StyleSheet } from "react-native"
import {
  responsive,
  colors,
  spacing,
  shadows,
  typography,
} from "../styles/global"

export const movieStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
    width: "100%",
    maxWidth: responsive.scale(600),
    alignSelf: "center",
    marginBottom: spacing.extraLarge,
  },
  scrollContentContainer: {
    paddingBottom: spacing.extraLarge,
    paddingTop: spacing.large,
    alignItems: "center",
    flexGrow: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  giveUpButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.quaternary,
    borderRadius: responsive.scale(10),
    padding: spacing.medium,
    width: "100%",
    ...shadows.light,
  },
  giveUpButtonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    textAlign: "center",
  },
  pressedButton: {
    transform: [{ translateY: 2 }],
    opacity: 0.8,
  },
  gameOverSubText: {
    ...typography.bodyText,
    color: colors.lightGrey,
    fontFamily: "Arvo-Italic",
    textAlign: "center",
    marginBottom: spacing.small,
  },
  gameOverCard: {
    backgroundColor: colors.grey,
    borderRadius: responsive.scale(12),
    padding: spacing.medium,
    alignItems: "center",
    width: "100%",
    marginVertical: spacing.medium,
    ...shadows.medium,
  },
  gameOverPoster: {
    width: "60%",
    aspectRatio: 2 / 3,
    borderRadius: responsive.scale(8),
    marginBottom: spacing.medium,
  },
  gameOverTitle: {
    ...typography.heading2,
    color: colors.secondary,
    textAlign: "center",
    marginBottom: spacing.extraSmall,
  },
  gameOverDirector: {
    ...typography.caption,
    color: colors.tertiary,
    fontFamily: "Arvo-Regular",
    textAlign: "center",
    marginBottom: spacing.medium,
  },
  gameOverStarring: {
    ...typography.bodyText,
    color: colors.primary,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
    marginTop: spacing.small,
    marginBottom: spacing.extraSmall,
  },
  gameOverButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: spacing.medium,
  },
  gameOverButton: {
    backgroundColor: colors.quinary,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
    borderRadius: responsive.scale(8),
    ...shadows.light,
    width: "80%",
    alignItems: "center",
  },
  gameOverButtonText: {
    ...typography.bodyText,
    fontFamily: "Arvo-Bold",
    color: colors.background,
  },
  comeBackText: {
    ...typography.caption,
    color: colors.grey,
    textAlign: "center",
    marginTop: spacing.small,
  },
})

export default movieStyles
