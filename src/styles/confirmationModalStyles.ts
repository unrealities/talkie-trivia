import { StyleSheet } from "react-native"
import { responsive, getTypography, getButtonStyles } from "./global"

export const getConfirmationModalStyles = (colors: any) => {
  const typography = getTypography(colors)
  const buttonStyles = getButtonStyles(colors)

  return StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
      backgroundColor: colors.background,
      borderRadius: responsive.scale(10),
      padding: responsive.scale(20),
      width: "80%",
      maxWidth: responsive.scale(400),
    },
    title: {
      ...typography.heading2,
      fontSize: responsive.responsiveFontSize(20),
      marginBottom: responsive.scale(10),
      textAlign: "center",
    },
    message: {
      ...typography.bodyText,
      marginBottom: responsive.scale(20),
      textAlign: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    button: {
      ...buttonStyles.base,
      padding: responsive.scale(10),
      minWidth: responsive.scale(100),
      shadowColor: "transparent",
      elevation: 0,
    },
    confirmButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: "transparent",
      borderColor: colors.error,
      borderWidth: 2,
    },
    confirmButtonText: {
      ...buttonStyles.text,
      color: colors.background,
    },
    cancelButtonText: {
      ...buttonStyles.text,
      color: colors.error,
    },
  })
}
