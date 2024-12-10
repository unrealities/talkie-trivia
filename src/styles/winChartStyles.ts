import { StyleSheet } from "react-native";
import { responsive } from "./global";

export const winChartStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "column",
    padding: responsive.scale(12),
    width: "100%",
  },
  victoryLabels: {
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(20),
  },
})
