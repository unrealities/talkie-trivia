import { StyleSheet } from "react-native"
import { colors } from "./global"

export const titleHeaderStyles = StyleSheet.create({
  container: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    borderTopColor: colors.primary,
    borderTopWidth: 2,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    marginTop: 30,
    minHeight: 60,
    minWidth: 300,
  },
  header: {
    color: colors.primary,
    fontFamily: "Arvo-Bold",
    fontSize: 24,
    paddingTop: 6,
    textAlign: "center",
  },
  subHeader: {
    color: colors.secondary,
    fontFamily: "Arvo-Italic",
    fontSize: 14,
    paddingBottom: 6,
    textAlign: "center",
  },
})
