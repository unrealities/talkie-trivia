import { StyleSheet } from "react-native"
import { colors, responsive, spacing } from "./global"

export const pickerStyles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    right: responsive.scale(10),
    top: responsive.scale(6),
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: responsive.scale(10),
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: responsive.scale(12),
    width: "100%",
    height: "auto",
    elevation: 0,
    boxShadow: "none",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: responsive.scale(2),
    borderColor: colors.primary,
    marginBottom: spacing.small,
    minHeight: responsive.scale(60),
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
    width: "95%",
    justifyContent: "space-between",
    flexDirection: "column",
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
    borderRadius: responsive.scale(4),
    borderWidth: 2,
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    marginBottom: spacing.extraSmall,
    maxWidth: responsive.scale(400),
    padding: responsive.scale(8),
    textAlign: "left",
    width: "100%",
  },
  inputContainer: {
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    width: "100%",
  },
  lightInputText: {
    color: colors.secondary,
  },
  noResultsText: {
    color: colors.tertiary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    padding: spacing.medium,
    textAlign: "center",
    fontWeight: "bold",
  },
  pressableText: {
    borderRadius: responsive.scale(5),
    flex: 1,
    fontFamily: "Arvo-Regular",
    padding: responsive.scale(6),
  },
  resultsContainer: {
    maxHeight: responsive.scale(95),
    minHeight: responsive.scale(95),
    overflow: "hidden",
    width: "100%",
  },
  resultsShow: {
    flex: 1,
  },
  searchIndicator: {
    marginLeft: responsive.scale(-25),
  },
  selectedMovie: {
    backgroundColor: colors.quinary,
    fontWeight: "bold",
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
  clearButton: {
    position: "absolute",
    right: responsive.scale(2),
    top: responsive.scale(14),
    backgroundColor: colors.grey,
    borderRadius: responsive.scale(10),
    width: responsive.scale(20),
    height: responsive.scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: colors.white,
    fontSize: responsive.responsiveFontSize(12),
  },
})

export default pickerStyles
