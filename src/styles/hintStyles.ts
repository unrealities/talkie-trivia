// src/styles/hintStyles.ts
import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const hintStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsive.scale(10),
    marginTop: responsive.scale(10),
  },
  hintButtonsContainer: {
    flexDirection: "row",
    alignItems: "center", // Vertically align hint label and button area
  },
  hintLabel: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    marginRight: responsive.scale(10), // Add some space between label and buttons
  },
  hintButtonArea: {
    flexDirection: "row", // Arrange buttons horizontally
    alignItems: "flex-start",
    justifyContent: "space-around",
  },
  hintButton: {
    borderRadius: responsive.scale(15),
    padding: responsive.scale(6),
    minWidth: responsive.scale(30),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: responsive.scale(6),
  },
  buttonText: {
    color: colors.secondary,
    fontSize: responsive.responsiveFontSize(16),
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  buttonTextSmall: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(10),
    textAlign: "center",
  },
  hintText: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    marginLeft: responsive.scale(12),
    textAlign: "center",
  },
})
