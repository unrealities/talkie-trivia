import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const playerStatsStyles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flex: 1,
    padding: responsive.scale(12),
    textAlign: "center",
    width: "95%",
  },
  header: {
    color: colors.lightGrey,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(14),
    minWidth: responsive.scale(120),
    textAlign: "left",
  },
  statContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: responsive.scale(8),
    width: "100%",
  },
  statsContainer: {
    alignItems: "flex-start",
    paddingTop: responsive.scale(20),
    width: "100%",
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    paddingLeft: responsive.scale(15),
    textAlign: "left",
    flexShrink: 1,
  },
  streakText: {
    fontSize: responsive.responsiveFontSize(16),
    fontFamily: "Arvo-Bold",
    color: colors.quinary,
  },
})
