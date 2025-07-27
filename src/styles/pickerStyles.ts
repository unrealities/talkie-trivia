import { StyleSheet } from "react-native"
import { colors, responsive, spacing } from "./global"

export const pickerStyles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    right: responsive.scale(10),
    top: responsive.scale(10),
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "column",
    marginTop: spacing.medium,
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
    fontFamily: "Arvo-Regular",
    padding: responsive.scale(8),
    flexDirection: "row",
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
  unselected: {
    color: colors.lightGrey,
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(14),
    flex: 1,
  },
  previewHintContainer: {
    position: "absolute",
    top: responsive.scale(5),
    right: responsive.scale(10),
    backgroundColor: colors.tertiary,
    borderRadius: responsive.scale(10),
    paddingVertical: responsive.scale(4),
    paddingHorizontal: responsive.scale(8),
    zIndex: 1,
    elevation: 1,
  },
  previewHintText: {
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(11),
    color: colors.background,
  },
})

export default pickerStyles
