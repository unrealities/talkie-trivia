import { StyleSheet } from "react-native"
import { colors, responsive, spacing } from "./global"

export const pickerStyles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    right: responsive.scale(10),
    top: responsive.scale(10),
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: responsive.scale(10),
    paddingVertical: spacing.medium,
    paddingHorizontal: responsive.scale(12),
    width: "100%",
    height: "auto",
    elevation: 0,
    alignItems: "center",
    justifyContent: "center",
    minHeight: responsive.scale(50),
    marginTop: spacing.medium,
  },
  buttonText: {
    fontSize: responsive.responsiveFontSize(18),
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
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
    flex: 1,
    borderColor: colors.lightGrey,
    borderRadius: responsive.scale(4),
    borderWidth: 2,
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    padding: responsive.scale(10),
    textAlign: "left",
  },
  inputContainer: {
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    width: "100%",
    marginBottom: spacing.extraSmall,
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
    padding: responsive.scale(8),
  },
  resultsContainer: {
    maxHeight: responsive.scale(100),
    minHeight: responsive.scale(100),
    overflow: "hidden",
    width: "100%",
    marginBottom: spacing.small,
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
    backgroundColor: colors.grey,
    opacity: 0.7,
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.grey,
    borderRadius: responsive.scale(8),
    paddingHorizontal: responsive.scale(12),
    paddingVertical: responsive.scale(8),
    width: "100%",
    marginBottom: spacing.small,
  },
  selectionText: {
    flex: 1,
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(15),
    marginRight: spacing.small,
  },
  clearSelectionButton: {
    padding: responsive.scale(5),
  },
})

export default pickerStyles
