import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const factsStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingBottom: responsive.scale(20),
    paddingHorizontal: responsive.scale(10),
    width: responsive.isLargeScreen() ? "60%" : "90%",
    maxWidth: responsive.scale(500),
  },
  header: {
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(24),
    paddingBottom: responsive.scale(10),
    textAlign: "center",
    color: colors.secondary, // Changed header color
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: responsive.scale(20),
    width: "100%",
  },
  posterImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 2 / 3,
    marginBottom: responsive.scale(10),
    borderRadius: responsive.scale(6),
    resizeMode: "contain",
  },
  subHeader: {
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(14),
    textAlign: "center",
    width: "90%",
    marginBottom: responsive.scale(10),
    color: colors.tertiary, // Changed to a muted orange
    fontStyle: "italic",
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    paddingTop: responsive.scale(10),
    textAlign: "center",
    marginBottom: responsive.scale(10),
    color: colors.secondary, // Changed to secondary color
    lineHeight: responsive.responsiveFontSize(18),
  },
  pressable: {
    width: "100%",
    alignItems: "center",
    paddingVertical: responsive.scale(10),
    backgroundColor: colors.background, // Added background color
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: responsive.scale(20),
    backgroundColor: colors.background, // Adjusted background
  },
  errorText: {
    color: colors.quaternary, // Changed to error color
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background, // Adjusted background
  },
})
