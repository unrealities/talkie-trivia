import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const titleHeaderStyles = StyleSheet.create({
  container: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    borderTopColor: colors.lightGrey,
    borderTopWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsive.scale(4),
    paddingVertical: responsive.scale(4),
    width: "100%",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  header: {
    color: colors.primary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(18),
    paddingTop: responsive.scale(4),
    textAlign: "center",
  },
})

export default titleHeaderStyles
