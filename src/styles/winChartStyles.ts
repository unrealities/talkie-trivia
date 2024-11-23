import { StyleSheet } from "react-native"
import { colors } from "./global"

export const winChartStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "column",
    padding: 12,
    width: "100%",
  },
  victoryLabels: {
    fontFamily: "Arvo-Bold",
    fontSize: 20,
  },
})
