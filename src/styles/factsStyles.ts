import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const factsStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingBottom: responsive.scale(20),
    paddingHorizontal: responsive.scale(10),
    width: responsive.scale(260),
  },
  header: {
    flexWrap: "wrap",
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(24),
    paddingBottom: responsive.scale(10),
    textAlign: "center",
    color: "#333",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: responsive.scale(20),
    width: "100%",
    flexGrow: 1,
  },
  posterImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 2 / 3,
    marginBottom: responsive.scale(10),
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subHeader: {
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(14),
    textAlign: "center",
    width: "90%",
    marginBottom: responsive.scale(10),
    color: "#666",
    fontStyle: "italic",
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    paddingTop: responsive.scale(10),
    textAlign: "center",
    marginBottom: responsive.scale(10),
    color: "#444",
  },
  pressable: {
    width: "100%",
    alignItems: "center",
    paddingVertical: responsive.scale(10),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: responsive.scale(20),
    backgroundColor: "#f8d7da",
  },
  errorText: {
    color: "#721c24",
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
})
