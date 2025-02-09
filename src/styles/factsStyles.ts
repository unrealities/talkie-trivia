import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const factsStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingBottom: responsive.scale(20),
    paddingHorizontal: responsive.scale(20),
    width: responsive.isLargeScreen() ? "70%" : "95%",
    maxWidth: responsive.scale(600),
  },
  header: {
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(24),
    paddingBottom: responsive.scale(15),
    textAlign: "center",
    color: colors.secondary,
  },
  subHeaderSmall: {
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(14),
    textAlign: "center",
    width: "90%",
    marginBottom: responsive.scale(8),
    color: colors.primary,
    fontStyle: "italic",
    lineHeight: responsive.responsiveFontSize(16),
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: responsive.scale(15),
    paddingBottom: responsive.scale(25),
    width: "100%",
  },
  posterImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 2 / 3,
    marginBottom: responsive.scale(15),
    borderRadius: responsive.scale(8),
    resizeMode: "contain",
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(16),
    paddingTop: responsive.scale(12),
    textAlign: "center",
    marginBottom: responsive.scale(12),
    color: colors.secondary,
    lineHeight: responsive.responsiveFontSize(20),
  },
  pressable: {
    width: "100%",
    alignItems: "center",
    paddingVertical: responsive.scale(10),
    backgroundColor: "transparent",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: responsive.scale(20),
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.quaternary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(18),
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
})
