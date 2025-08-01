import { StyleSheet } from "react-native"
import { colors, responsive, spacing, shadows } from "./global"

export const pickerStyles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    right: spacing.small,
    top: responsive.scale(12),
  },
  container: {
    width: "100%",
    marginTop: spacing.medium,
    marginBottom: spacing.medium,
    zIndex: 10,
  },
  errorText: {
    color: colors.error,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    padding: spacing.medium,
    textAlign: "center",
  },
  input: {
    flex: 1,
    borderColor: colors.border,
    borderRadius: responsive.scale(8),
    borderWidth: 2,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    paddingHorizontal: spacing.medium,
    paddingVertical: responsive.scale(12),
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    position: "relative",
    width: "100%",
  },
  noResultsText: {
    color: colors.textSecondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    padding: spacing.medium,
    textAlign: "center",
  },
  resultsContainer: {
    position: "absolute",
    top: responsive.scale(55),
    left: 0,
    right: 0,
    maxHeight: responsive.scale(200),
    backgroundColor: colors.backgroundLight,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: responsive.scale(8),
    ...shadows.medium,
  },
  resultsShow: {
    flex: 1,
  },
  resultItem: {
    padding: spacing.small,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: responsive.scale(4),
    marginHorizontal: spacing.extraSmall,
  },
  resultImage: {
    width: responsive.scale(30),
    height: responsive.scale(45),
    borderRadius: responsive.scale(4),
    marginRight: spacing.medium,
    backgroundColor: colors.surface,
  },
  unselected: {
    color: colors.textSecondary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
    flex: 1,
  },
  previewHintContainer: {
    position: "absolute",
    bottom: spacing.small,
    right: spacing.small,
    backgroundColor: colors.tertiary,
    borderRadius: responsive.scale(12),
    paddingVertical: responsive.scale(4),
    paddingHorizontal: spacing.small,
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
