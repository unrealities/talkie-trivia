import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const pickerStyles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    right: responsive.scale(10),
    top: responsive.scale(6),
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: responsive.scale(10),
    paddingVertical: responsive.scale(10), // Increased vertical padding
    paddingHorizontal: responsive.scale(15), // Increased horizontal padding
    width: "100%",
    height: "auto",
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
    alignItems: "center", // Ensure text is centered
    justifyContent: "center",
  },
  buttonSmall: {
    minHeight: responsive.scale(55),
  },
  buttonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(16), // Slightly larger button text
    textAlign: "center",
    paddingVertical: responsive.scale(2),
  },
  buttonTextSmall: {
    fontSize: responsive.responsiveFontSize(12),
  },
  container: {
    flex: 1, // added flex 1
    minHeight: responsive.scale(180),
    maxWidth: responsive.scale(350), // Increased max width to match movie container
    width: "100%",
    alignSelf: "center",
    marginBottom: responsive.scale(10),
  },
  input: {
    alignSelf: "flex-start",
    borderColor: colors.primary,
    borderRadius: responsive.scale(10),
    borderWidth: 2,
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    padding: responsive.scale(8), // Slightly more padding in input
    textAlign: "center",
    width: "100%",
    marginBottom: responsive.scale(10),
    maxWidth: responsive.scale(350), //Increased max width to match movie container
    fontSize: responsive.responsiveFontSize(14), //Slightly larger input text
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: responsive.scale(6),
    position: "relative",
  },
  pressableText: {
    flex: 1,
    fontFamily: "Arvo-Regular",
    padding: responsive.scale(4),
    borderRadius: responsive.scale(5),
  },
  searchIndicator: {
    marginLeft: responsive.scale(-25),
  },
  selectedMovie: {
    backgroundColor: colors.quinary,
  },
  resultsContainer: {
    marginBottom: responsive.scale(6),
    maxHeight: responsive.scale(82),
    minHeight: responsive.scale(82),
    maxWidth: responsive.scale(350), // Increased max width to match movie container
    width: "100%",
  },
  resultsShow: {
    flex: 1,
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(12),
    padding: responsive.scale(10),
    lineHeight: responsive.responsiveFontSize(16),
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
  disabledButton: {
    backgroundColor: colors.tertiary, // Slightly different for disabled button
    opacity: 0.7,
  },
})
