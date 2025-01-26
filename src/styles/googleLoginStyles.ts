import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const googleLoginStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: responsive.scale(10),
    justifyContent: "center",
    alignItems: "center",
    height: responsive.scale(40),
    width: "100%",
    maxWidth: responsive.scale(280),
    elevation: 4, // Add a subtle elevation (Android)
    shadowColor: "black", // Add a shadow (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
    fontSize: responsive.responsiveFontSize(16),
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: responsive.isLargeScreen() ? "60%" : "90%",
    maxWidth: responsive.scale(400),
    alignSelf: "center",
    paddingVertical: responsive.scale(20),
  },
  errorText: {
    color: colors.quaternary, // Changed to error color
    fontFamily: "Arvo-Regular",
    marginTop: responsive.scale(8),
    textAlign: "center",
    fontSize: responsive.responsiveFontSize(16),
  },
})
