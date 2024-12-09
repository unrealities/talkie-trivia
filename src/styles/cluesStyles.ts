import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const cluesStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginVertical: responsive.scale(10),
    minWidth: responsive.scale(300),
    minHeight: responsive.scale(250),
  },
  countContainer: {
    alignSelf: "flex-end",
    marginTop: responsive.scale(8),
    maxHeight: responsive.scale(16),
    justifyContent: "flex-end",
  },
  textContainer: {
    flexWrap: "wrap",
    maxWidth: responsive.scale(300),
    minWidth: responsive.scale(280),
    textAlign: "left",
    paddingHorizontal: responsive.scale(10),
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    paddingBottom: responsive.scale(4),
  },
  wordCountText: {
    color: colors.primary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(8),
    textAlign: "right",
  },
})
