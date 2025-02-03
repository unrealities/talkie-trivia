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
    alignItems: "center",
    maxWidth: "100%",
    flexWrap: "wrap",
  },
  hintLabel: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    marginRight: responsive.scale(4),
    marginBottom: responsive.scale(2),
  },
  hintButtonArea: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  hintButton: {
    borderRadius: responsive.scale(15),
    padding: responsive.scale(4),
    minWidth: responsive.scale(25),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: responsive.scale(2),
    marginVertical: responsive.scale(2),
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
    marginLeft: responsive.scale(8),
    textAlign: "center",
  },
})
