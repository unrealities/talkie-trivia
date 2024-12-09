import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const googleLoginStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: responsive.scale(10),
    justifyContent: "center",
    alignItems: "center",
    height: responsive.scale(40),
    width: responsive.scale(280),
    alignSelf: "center",
  },
  buttonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: responsive.scale(300),
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    fontFamily: "Arvo-Regular",
    marginTop: responsive.scale(8),
    textAlign: "center",
  },
})
