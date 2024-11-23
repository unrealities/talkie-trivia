import { StyleSheet } from "react-native"
import { colors } from "./global"

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
    paddingBottom: 4,
    paddingTop: 4,
    marginTop: 20,
    maxHeight: 75,
    minHeight: 20,
    minWidth: 300,
  },
  connected: {
    color: colors.primary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: 24,
    marginTop: 6,
    textAlign: "center",
  },
  notConnected: {
    color: colors.quaternary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: 24,
    marginTop: 6,
    textAlign: "center",
  },
})
