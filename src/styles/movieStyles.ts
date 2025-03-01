import { StyleSheet, Dimensions } from "react-native"
import { responsive, colors } from "../styles/global"

const { width, height } = Dimensions.get("window")

export const movieStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    flexGrow: 1,
    minWidth: responsive.scale(320),
    maxWidth: responsive.scale(400),
    width: "95%",
    alignSelf: "center",
    marginBottom: responsive.scale(20),
  },
  disabledButton: {
    opacity: 0.6,
  },
  feedbackContainer: {
    alignItems: "center",
    backgroundColor: colors.quinary,
    borderRadius: responsive.scale(8),
    marginBottom: responsive.scale(15),
    marginTop: responsive.scale(15),
    padding: responsive.scale(10),
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
    marginBottom: responsive.scale(30),
    marginTop: responsive.scale(25),
    padding: responsive.scale(12),
    width: "90%",
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
    paddingBottom: responsive.scale(20),
    paddingTop: responsive.scale(20),
    alignItems: "center",
    flexGrow: 1,
  },
})

export default movieStyles
