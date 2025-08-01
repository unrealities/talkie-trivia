import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const hintStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: responsive.scale(2),
    width: "100%",
  },
  hintButtonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
  },
  hintLabel: {
    color: colors.textSecondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(14),
    marginVertical: responsive.scale(4),
    textAlign: "center",
    width: "100%",
    paddingVertical: responsive.scale(4),
  },
  skeletonLabel: {
    backgroundColor: colors.grey,
    height: responsive.scale(20),
    width: "50%",
    borderRadius: responsive.scale(4),
    marginVertical: responsive.scale(10),
  },
  hintButtonArea: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap",
    width: "100%",
  },
  hintButton: {
    borderRadius: responsive.scale(4),
    padding: responsive.scale(6),
    minWidth: "20%",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: responsive.scale(4),
    marginVertical: responsive.scale(8),
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  usedHintButton: {
    backgroundColor: "transparent",
    opacity: 0.8,
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
    color: colors.textSecondary,
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
