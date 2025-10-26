import { StyleSheet } from "react-native"
import { responsive } from "./global"

export const getPlayerStatsStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: "flex-start",
      flex: 1,
      padding: responsive.scale(10),
      textAlign: "center",
      width: "100%",
    },
    header: {
      color: colors.textSecondary,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(16),
      minWidth: responsive.scale(120),
      textAlign: "left",
    },
    statContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: responsive.scale(4),
      width: "100%",
    },
    statsContainer: {
      alignItems: "flex-start",
      paddingTop: responsive.scale(15),
      width: "100%",
    },
    text: {
      color: colors.quinary,
      flex: 1,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(16),
      paddingLeft: responsive.scale(12),
      textAlign: "right",
      flexShrink: 1,
    },
    scoreText: {
      fontSize: responsive.responsiveFontSize(16),
      fontFamily: "Arvo-Bold",
      color: colors.quinary,
    },
    streakText: {
      fontSize: responsive.responsiveFontSize(16),
      fontFamily: "Arvo-Bold",
      color: colors.quinary,
    },
  })
