import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const pickerStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: responsive.scale(10),
    maxHeight: responsive.scale(40),
    minHeight: responsive.scale(40),
    padding: responsive.scale(8),
    width: responsive.scale(300),
  },
  buttonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    textAlign: "center",
  },
  container: {
    flex: 1,
    minHeight: responsive.scale(180),
  },
  input: {
    alignSelf: "flex-start",
    borderColor: colors.primary,
    borderRadius: responsive.scale(10),
    borderWidth: 2,
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    maxWidth: responsive.scale(300),
    padding: responsive.scale(5),
    textAlign: "center",
    width: responsive.scale(300),
  },
  pressableText: {
    flex: 1,
    fontFamily: "Arvo-Regular",
    padding: responsive.scale(5),
    borderRadius: responsive.scale(5),
  },
  selectedMovie: {
    backgroundColor: colors.quinary,
  },
  resultsShow: {
    flex: 1,
    maxHeight: responsive.scale(82),
    maxWidth: responsive.scale(280),
    minHeight: responsive.scale(82),
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(12),
    padding: responsive.scale(10),
    lineHeight: responsive.scale(16),
    marginBottom: responsive.scale(10),
  },
  noResultsText: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    color: colors.tertiary,
    textAlign: "center",
  },
  errorText: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    color: colors.quaternary,
    textAlign: "center",
    padding: responsive.scale(10),
  },
  unselected: {
    color: colors.secondary,
    fontFamily: "Arvo-Italic",
  },
})
