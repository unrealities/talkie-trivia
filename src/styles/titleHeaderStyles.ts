import { StyleSheet } from "react-native"
import { responsive } from "./global"

export const getTitleHeaderStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "flex-start",
      paddingVertical: responsive.scale(4),
      flex: 1,
    },
    header: {
      color: colors.primary,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(18),
      textAlign: "left",
    },
  })
