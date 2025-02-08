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
    paddingVertical: responsive.scale(6), // Increased vertical padding
    width: "100%",
  },
  statsContainer: {
    alignItems: "flex-start", // Align stats to the start
    paddingTop: responsive.scale(15), //Increased padding top
    width: "100%",
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(12),
    paddingLeft: responsive.scale(12),
    textAlign: "left",
    flexShrink: 1,
  },
  streakText: {
    fontSize: responsive.responsiveFontSize(14), //Larger font for streak values
    fontFamily: "Arvo-Bold", // Bold font for streaks
    color: colors.quinary, //Highlight color for streaks
  },
})
