import { StyleSheet } from "react-native"
import { responsive } from "./global"

export const getResetStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      marginTop: responsive.scale(16),
      padding: responsive.scale(8),
    },
    text: {
      color: colors.textPrimary,
      flex: 1,
      fontFamily: "Arvo-Italic",
      fontSize: responsive.responsiveFontSize(20),
    },
  })
