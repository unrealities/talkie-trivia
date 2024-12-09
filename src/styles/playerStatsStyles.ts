import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const playerStatsStyles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flex: 1,
    padding: responsive.scale(8),
    textAlign: "center",
    width: "90%",
  },
  header: {
    color: colors.primary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(12),
    minWidth: responsive.scale(100),
    textAlign: "left",
  },
  statContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: responsive.scale(4),
  },
  statsContainer: {
    alignItems: "center",
    paddingTop: responsive.scale(10),
    width: "100%",
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(12),
    paddingLeft: responsive.scale(12),
    textAlign: "left",
  },
})
