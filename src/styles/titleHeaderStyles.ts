import { StyleSheet } from "react-native"
import { responsive, getTypography } from "./global"

export const getTitleHeaderStyles = (colors: any) => {
  const typography = getTypography(colors)

  return StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "flex-start",
      paddingVertical: responsive.scale(4),
      flex: 1,
    },
    header: {
      ...typography.heading2,
      fontSize: responsive.responsiveFontSize(18),
      color: colors.primary,
      textAlign: "left",
    },
  })
}
