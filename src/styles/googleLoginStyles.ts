import { StyleSheet } from "react-native"
import { colors } from "../styles/global"

export const googleLoginStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 280,
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
    width: 300,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    fontFamily: "Arvo-Regular",
    marginTop: 8,
    textAlign: "center",
  }
})
