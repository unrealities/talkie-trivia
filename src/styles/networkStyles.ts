import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

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
    alignSelf: "center",
    width: "90%",
    maxWidth: responsive.scale(450),
    marginBottom: responsive.scale(10),
    paddingVertical: responsive.scale(10),
  },
  connected: {
    color: colors.primary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(20),
    marginTop: responsive.scale(6),
    textAlign: "center",
  },
  notConnected: {
    color: colors.quaternary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(20),
    marginTop: responsive.scale(6),
    textAlign: "center",
  },
})
