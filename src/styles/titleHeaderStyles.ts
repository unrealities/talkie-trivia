import { StyleSheet } from "react-native";
import { colors, responsive } from "./global";

export const titleHeaderStyles = StyleSheet.create({
  container: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    borderTopColor: colors.primary,
    borderTopWidth: 2,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: responsive.scale(6),
    marginTop: responsive.scale(30),
    minHeight: responsive.scale(60),
    width: "100%",
  },
  header: {
    color: colors.primary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(24),
    paddingTop: responsive.scale(6),
    textAlign: "center",
  },
  subHeader: {
    color: colors.secondary,
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(12),
    paddingBottom: responsive.scale(6),
    textAlign: "center",
  },
})
