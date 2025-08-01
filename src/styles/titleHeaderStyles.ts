import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const titleHeaderStyles = StyleSheet.create({
  container: {
    borderBottomColor: colors.textSecondary,
    borderBottomWidth: 1,
    borderTopColor: colors.textSecondary,
    borderTopWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsive.scale(4),
    paddingVertical: responsive.scale(4),
    width: "100%",
    boxShadow: "none",
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
