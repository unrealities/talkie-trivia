import { StyleSheet, Dimensions } from "react-native"
import {
  responsive,
  colors,
  spacing,
  shadows,
  typography,
} from "../styles/global"

const { width, height } = Dimensions.get("window")

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
    paddingTop: spacing.extraLarge,
    alignItems: "center",
    flexGrow: 1,
  },
  gameplayContainer: {
    width: "100%",
    alignItems: "center",
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
  gameOverContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingTop: spacing.large,
    width: "100%",
  },
  gameOverPoster: {
    width: "70%",
    aspectRatio: 2 / 3,
    borderRadius: responsive.scale(12),
    ...shadows.medium,
    marginBottom: spacing.medium,
  },
  gameOverTitle: {
    ...typography.heading2,
    color: colors.primary,
    textAlign: "center",
    paddingHorizontal: spacing.medium,
    marginVertical: spacing.small,
  },
  gameOverSubText: {
    ...typography.bodyText,
    color: colors.lightGrey,
    fontFamily: "Arvo-Italic",
    textAlign: "center",
    marginBottom: spacing.large,
  },
  detailsButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
    borderRadius: responsive.scale(8),
    ...shadows.light,
  },
  detailsButtonText: {
    ...typography.bodyText,
    fontFamily: "Arvo-Bold",
    color: colors.secondary,
  },
  comeBackText: {
    ...typography.caption,
    color: colors.grey,
    marginTop: spacing.large,
  },
})

export default movieStyles
