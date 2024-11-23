import { StyleSheet } from "react-native"
import { colors } from "./global"

export const pickerStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    maxHeight: 40,
    minHeight: 40,
    padding: 10,
    width: 300,
  },
  buttonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    flex: 1,
    minHeight: 180,
  },
  input: {
    alignSelf: "flex-start",
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    maxWidth: 300,
    padding: 5,
    textAlign: "center",
    width: 300,
  },
  pressableText: {
    flex: 1,
    fontFamily: "Arvo-Regular",
    padding: 5,
    borderRadius: 5,
  },
  selectedMovie: {
    backgroundColor: colors.quinary,
  },
  resultsShow: {
    flex: 1,
    maxHeight: 82,
    maxWidth: 280,
    minHeight: 82,
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: 12,
    padding: 10,
    lineHeight: 16,
    marginBottom: 10,
  },
  noResultsText: {
    fontFamily: "Arvo-Regular",
    fontSize: 14,
    color: colors.tertiary,
    textAlign: "center",
  },
  errorText: {
    fontFamily: "Arvo-Regular",
    fontSize: 14,
    color: colors.quaternary,
    textAlign: "center",
    padding: 10,
  },
  unselected: {
    color: colors.secondary,
    fontFamily: "Arvo-Italic",
  },
})
