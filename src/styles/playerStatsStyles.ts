import { StyleSheet } from "react-native"
import { colors } from "./global"

export const playerStatsStyles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flex: 1,
    padding: 8,
    textAlign: "center",
    width: "90%",
  },
  header: {
    color: colors.primary,
    fontFamily: "Arvo-Bold",
    fontSize: 12,
    minWidth: 100,
    textAlign: "left",
  },
  statContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  statsContainer: {
    alignItems: "center",
    paddingTop: 10,
    width: "100%",
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: 12,
    paddingLeft: 12,
    textAlign: "left",
  },
})
