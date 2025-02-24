import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const hintStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: responsive.scale(2),
  },
  hintButtonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "100%",
    flexWrap: "wrap",
  },
  hintLabel: {
    color: colors.lightGrey,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    marginBottom: responsive.scale(4),
    textAlign: "center",
    width: "100%",
    paddingVertical: responsive.scale(8),
  },
  hintButtonArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "nowrap",
    width: "100%",
    overflow: "hidden",
  },
  hintButton: {
    borderRadius: responsive.scale(8),
    padding: responsive.scale(12),
    minWidth: responsive.scale(75),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: responsive.scale(5),
    marginVertical: responsive.scale(8),
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  usedHintButton: {
    backgroundColor: "transparent",
    opacity: 0.6,
    borderColor: colors.tertiary,
  },
  buttonText: {
    color: colors.secondary,
    fontSize: responsive.responsiveFontSize(16),
    textAlign: "center",
    marginTop: responsive.scale(2),
  },
  disabled: {
    opacity: 0.5,
  },
  buttonTextSmall: {
    color: colors.lightGrey,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(12),
    textAlign: "center",
  },
  hintText: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(16),
    marginLeft: responsive.scale(8),
    textAlign: "center",
    marginVertical: responsive.scale(10),
  },
})

export const hintStyle = StyleSheet.create({})
