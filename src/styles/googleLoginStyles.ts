import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const googleLoginStyles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: responsive.scale(8),
    justifyContent: "center",
    alignItems: "center",
    height: responsive.scale(40),
    width: "100%",
    maxWidth: responsive.scale(280),
    elevation: 0,
    boxShadow: "none",
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
    width: responsive.isLargeScreen() ? "60%" : "95%",
    maxWidth: responsive.scale(400),
    alignSelf: "center",
    paddingVertical: responsive.scale(25),
  },
  errorText: {
    color: colors.quaternary,
    fontFamily: "Arvo-Regular",
    marginTop: responsive.scale(10),
    textAlign: "center",
    fontSize: responsive.responsiveFontSize(14),
  },
})
