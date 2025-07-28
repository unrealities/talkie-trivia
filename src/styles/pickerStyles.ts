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
    marginBottom: spacing.medium,
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
  resultsContainer: {
    maxHeight: responsive.scale(120),
    minHeight: responsive.scale(120),
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: responsive.scale(4),
    padding: spacing.extraSmall,
  },
  resultsShow: {
    flex: 1,
  },
  resultItem: {
    padding: responsive.scale(5),
    flexDirection: "row",
    alignItems: "center",
    borderRadius: responsive.scale(4),
  },
  resultImage: {
    width: responsive.scale(30),
    height: responsive.scale(45),
    borderRadius: responsive.scale(2),
    marginRight: responsive.scale(10),
    backgroundColor: colors.grey,
  },
  unselected: {
    color: colors.lightGrey,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    flex: 1,
  },
  previewHintContainer: {
    position: "absolute",
    bottom: responsive.scale(5),
    right: responsive.scale(5),
    backgroundColor: colors.tertiary,
    borderRadius: responsive.scale(10),
    paddingVertical: responsive.scale(2),
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
