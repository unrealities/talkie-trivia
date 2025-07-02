import { StyleSheet, Platform } from "react-native"
import { colors, responsive } from "./global"

export const appStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    paddingTop: Platform.select({
      ios: responsive.scale(20),
      android: responsive.scale(10),
      default: 0,
    }),
    paddingHorizontal: responsive.scale(10),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    width: "100%",
  },
  messageText: {
    marginTop: responsive.scale(20),
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(16),
    color: colors.secondary,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: responsive.scale(20),
  },
  errorText: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(18),
    color: colors.quaternary,
    textAlign: "center",
    width: "80%",
  },
})
