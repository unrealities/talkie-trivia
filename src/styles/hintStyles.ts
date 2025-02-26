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
    fontSize: responsive.responsiveFontSize(14),
    marginVertical: responsive.scale(4),
    textAlign: "center",
    width: "100%",
    paddingVertical: responsive.scale(4),
  },
  hintButtonArea: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap",
    width: "100%",
    overflow: "hidden",
  },
  hintButton: {
    borderRadius: responsive.scale(4),
    padding: responsive.scale(6),
    minWidth: responsive.scale(58),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: responsive.scale(2),
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
    fontSize: responsive.responsiveFontSize(14),
    textAlign: "center",
    marginTop: responsive.scale(4),
  },
  disabled: {
    opacity: 0.5,
  },
  buttonTextSmall: {
    color: colors.lightGrey,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(12),
    marginTop: responsive.scale(4),
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
