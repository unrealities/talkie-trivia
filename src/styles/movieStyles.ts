import { StyleSheet, Dimensions } from "react-native"
import { responsive, colors } from "./global"

const { width, height } = Dimensions.get("window")

export const movieStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    marginTop: height * 0.02, // Reduced top margin
    width: "95%", // Slightly wider container
    alignSelf: "center",
    maxWidth: responsive.scale(350), // Increased max width
    paddingHorizontal: responsive.scale(10), // Added horizontal padding
  },
  feedbackContainer: {
    backgroundColor: colors.quinary, // Example background color
    padding: responsive.scale(8),
    borderRadius: responsive.scale(5),
    marginTop: responsive.scale(10),
    marginBottom: responsive.scale(5),
  },
  feedbackText: {
    color: colors.background, // Ensure text is visible on feedback background
    textAlign: "center",
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(14),
  },
  giveUpButton: {
    backgroundColor: colors.quaternary, // Distinct color for give up
    borderRadius: responsive.scale(10),
    padding: responsive.scale(10),
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsive.scale(15), // More margin to separate from guesses
    elevation: 2, // Add elevation for visual lift
  },
  giveUpButtonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.6, //Reduce opacity for disabled state
  },
  pressedButton: {
    opacity: 0.8, //Visual feedback for pressing
  },
})
