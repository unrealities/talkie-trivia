import { StyleSheet } from "react-native"
import { responsive } from "./global"

export const getGoogleLoginStyles = (colors: any) =>
  StyleSheet.create({
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
      shadowColor: "transparent",
    },
    buttonText: {
      color: colors.textPrimary,
      fontFamily: "Arvo-Bold",
      textAlign: "center",
      fontSize: responsive.responsiveFontSize(16),
    },
    container: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      maxWidth: responsive.scale(400),
      alignSelf: "center",
      paddingVertical: responsive.scale(25),
    },
    errorText: {
      color: colors.error,
      fontFamily: "Arvo-Regular",
      marginTop: responsive.scale(10),
      textAlign: "center",
      fontSize: responsive.responsiveFontSize(14),
    },
  })
