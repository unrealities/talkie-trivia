import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const pickerStyles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    right: responsive.scale(10),
    top: responsive.scale(6),
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: responsive.scale(10),
    paddingVertical: responsive.scale(10),
    paddingHorizontal: responsive.scale(12),
    width: "100%",
    height: "auto",
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    boxShadow: "none",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
    minHeight: responsive.scale(60)
  },
  buttonText: {
    fontSize: responsive.responsiveFontSize(16),
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    textAlign: "center",
    paddingVertical: responsive.scale(2),
  },
  buttonTextSmall: {
    fontSize: responsive.responsiveFontSize(13),
  },
  container: {
    flex: 1,
    minHeight: responsive.scale(200),
    maxWidth: responsive.scale(400),
    width: "100%",
    alignSelf: "center",
  },
  errorText: {
    color: colors.quaternary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    padding: responsive.scale(10),
    textAlign: "center",
  },
  input: {
    alignSelf: "flex-start",
    borderColor: colors.lightGrey,
    borderRadius: responsive.scale(8),
    borderWidth: 2,
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    marginBottom: responsive.scale(8),
    maxWidth: responsive.scale(400),
    padding: responsive.scale(8),
    textAlign: "left",
    width: "100%",
  },
  inputContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: responsive.scale(8),
    position: "relative",
    width: "100%",
  },
  noResultsText: {
    color: colors.lightGrey,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    padding: responsive.scale(8),
    textAlign: "center",
  },
  pressableText: {
    borderRadius: responsive.scale(5),
    flex: 1,
    fontFamily: "Arvo-Regular",
    padding: responsive.scale(6),
  },
  resultsContainer: {
    marginBottom: responsive.scale(8),
    maxHeight:
      responsive.scale(100),
    minHeight: responsive.scale(60),
    maxWidth: responsive.scale(400),
    overflow: "hidden",
    borderColor: colors.lightGrey,
    borderRadius: responsive.scale(8),
    borderWidth: 1,
    width: "100%",
  },
  resultsShow: {
    flex: 1,
    maxWidth: responsive.scale(320),
  },
  searchIndicator: {
    marginLeft: responsive.scale(-25),
  },
  selectedMovie: {
    backgroundColor: colors.grey,
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(12),
    lineHeight: responsive.responsiveFontSize(16),
    marginBottom: responsive.scale(10),
    padding: responsive.scale(10),
  },
  unselected: {
    color: colors.lightGrey,
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(14),
  },
  disabledButton: {
    backgroundColor: "transparent",
    borderColor: colors.tertiary,
    opacity: 0.5,
  },
})

export default pickerStyles
