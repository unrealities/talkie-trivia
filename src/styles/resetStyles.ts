import { StyleSheet } from "react-native"
import { colors } from "./global"

export const resetStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: 16,
    padding: 8,
  },
  text: {
    color: colors.secondary,
    flex: 1,
    fontFamily: "Arvo-Italic",
    fontSize: 20,
  },
})
