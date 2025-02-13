import { StyleSheet, Dimensions } from "react-native"
import { responsive, colors } from "./global"

const { width, height } = Dimensions.get("window")

export const movieStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",

    width: "95%",
    alignSelf: "center",
    maxWidth: responsive.scale(400),
    paddingHorizontal: responsive.scale(15),
  },
  scrollContentContainer: {
    paddingBottom: responsive.scale(20),
  },
  feedbackContainer: {
    backgroundColor: colors.quinary,
    padding: responsive.scale(10),
    borderRadius: responsive.scale(8),
    marginTop: responsive.scale(12),
    marginBottom: responsive.scale(8),
  },
  feedbackText: {
    color: colors.background,
    textAlign: "center",
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
  },
  giveUpButton: {
    backgroundColor: colors.quaternary,
    borderRadius: responsive.scale(10),
    padding: responsive.scale(12),
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsive.scale(25),
    marginBottom: responsive.scale(20),
    elevation: 0,
    borderWidth: 2,
    borderColor: colors.quaternary,
    alignSelf: "center",
    width: "90%",
  },
  giveUpButtonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressedButton: {
    opacity: 0.8,
  },
})

export default movieStyles
