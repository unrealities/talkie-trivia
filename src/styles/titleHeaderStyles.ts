import { StyleSheet } from "react-native"
import { responsive } from "./global"

export const getTitleHeaderStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      borderStyle: "solid",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: responsive.scale(4),
      paddingVertical: responsive.scale(4),
      width: "100%",
    },
    header: {
      color: colors.primary,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(18),
      paddingTop: responsive.scale(4),
      textAlign: "center",
    },
  })
