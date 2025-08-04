import { StyleSheet } from "react-native"
import { responsive } from "./global"

export const getWinChartStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      alignSelf: "center",
      flex: 1,
      flexDirection: "column",
      padding: responsive.scale(15),
      width: "100%",
    },
    emptyContainer: {
      padding: responsive.scale(20),
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      color: colors.textSecondary,
      fontFamily: "Arvo-Italic",
      textAlign: "center",
    },
    victoryLabels: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(20),
    },
  })
