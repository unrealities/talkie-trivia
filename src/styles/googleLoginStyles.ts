import { StyleSheet } from "react-native"
import { colors } from "../styles/global"

export const googleLoginStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 1,
    maxHeight: 40,
    padding: 10,
    width: 280,
  },
  buttonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    maxHeight: 60,
    padding: 8,
    width: 300,
  },
})
