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
    paddingTop: spacing.extraLarge,
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
    marginBottom: spacing.medium,
  },
  gameOverButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: spacing.medium,
  },
  shareButton: {
    backgroundColor: colors.quinary,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
    borderRadius: responsive.scale(8),
    ...shadows.light,
    width: "80%",
    alignItems: "center",
  },
  detailsButtonText: {
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
