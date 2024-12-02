import { StyleSheet, Dimensions } from "react-native"
import { colors } from "./global"

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
    paddingBottom: 4,
    paddingTop: 4,
    marginTop: 20,
    maxHeight: 75,
    minHeight: 20,
    minWidth: width * 0.8,
    width: width * 0.9,
    alignSelf: "center",
  },
  connected: {
    color: colors.primary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: Math.min(24, width * 0.06),
    marginTop: 6,
    textAlign: "center",
  },
  notConnected: {
    color: colors.quaternary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: Math.min(24, width * 0.06),
    marginTop: 6,
    textAlign: "center",
  },
})
