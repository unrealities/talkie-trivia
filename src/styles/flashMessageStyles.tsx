import { StyleSheet } from "react-native"
import { responsive } from "./global"

export const getFlashMessageStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: responsive.scale(30),
      left: 0,
      right: 0,
      zIndex: 1000,
      alignItems: "center",
      justifyContent: "center",
    },
    messageBox: {
      backgroundColor: colors.tertiary,
      borderRadius: responsive.scale(8),
      paddingVertical: responsive.scale(10),
      paddingHorizontal: responsive.scale(20),
      marginHorizontal: responsive.scale(20),
    },
    messageText: {
      color: colors.background,
      fontSize: responsive.responsiveFontSize(16),
      fontFamily: "Arvo-Bold",
      textAlign: "center",
    },
  })
