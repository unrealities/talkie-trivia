import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const resetStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: responsive.scale(16),
    padding: responsive.scale(8),
  },
  text: {
    color: colors.secondary,
    flex: 1,
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(20),
  },
})
