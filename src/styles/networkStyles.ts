import { StyleSheet, Dimensions } from "react-native"
import { colors, responsive } from "./global"

const { width } = Dimensions.get("window")

export const networkStyles = StyleSheet.create({
  containerConnected: {
    display: "none",
  },
  containerNotConnected: {
    borderBottomColor: colors.quaternary,
    borderBottomWidth: 2,
    borderTopColor: colors.quaternary,
    borderTopWidth: 2,
    borderStyle: "solid",
    flex: 1,
    justifyContent: "center",
    paddingBottom: responsive.scale(4),
    paddingTop: responsive.scale(4),
    marginTop: responsive.scale(20),
    maxHeight: responsive.scale(75),
    minHeight: responsive.scale(20),
    minWidth: width * 0.8,
    width: width * 0.9,
    alignSelf: "center",
  },
  connected: {
    color: colors.primary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(24),
    marginTop: responsive.scale(6),
    textAlign: "center",
  },
  notConnected: {
    color: colors.quaternary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(24),
    marginTop: responsive.scale(6),
    textAlign: "center",
  },
})
