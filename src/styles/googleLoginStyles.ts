import { StyleSheet } from "react-native"
import { responsive, getButtonStyles } from "./global"

export const getGoogleLoginStyles = (colors: any) => {
  const buttonStyles = getButtonStyles(colors)

  return StyleSheet.create({
    button: {
      ...buttonStyles.base,
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.primary,
      height: responsive.scale(40),
      width: "100%",
      maxWidth: responsive.scale(280),
      elevation: 0,
      shadowColor: "transparent",
    },
    buttonText: {
      ...buttonStyles.text,
      color: colors.textPrimary,
    },
    container: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      maxWidth: responsive.scale(400),
      alignSelf: "center",
      paddingVertical: responsive.scale(10),
    },
    errorText: {
      color: colors.error,
      fontFamily: "Arvo-Regular",
      marginTop: responsive.scale(10),
      textAlign: "center",
      fontSize: responsive.responsiveFontSize(14),
    },
  })
}
