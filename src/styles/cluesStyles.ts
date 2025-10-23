import { StyleSheet } from "react-native"
import { responsive, spacing } from "./global"

export const getCluesStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      marginVertical: spacing.extraSmall,
      minHeight: responsive.scale(160),
      paddingHorizontal: spacing.small,
      width: "100%",
      alignSelf: "stretch",
    },
    countContainer: {
      alignSelf: "flex-end",
      marginBottom: responsive.scale(4),
      marginRight: spacing.large,
      marginTop: spacing.small,
    },
    scrollView: {
      flexGrow: 1,
      width: "100%",
      alignSelf: "stretch",
    },
    scrollViewContent: {
      paddingBottom: spacing.extraSmall,
    },
    skeletonContainer: {
      paddingHorizontal: spacing.small,
      paddingVertical: spacing.small,
    },
    skeletonLine: {
      backgroundColor: colors.surface,
      borderRadius: responsive.scale(4),
      height: responsive.responsiveFontSize(14),
      marginBottom: spacing.small,
    },
    skeletonLineShort: {
      width: "70%",
    },
    cluesBox: {
      paddingHorizontal: spacing.medium,
      paddingVertical: spacing.medium,
      width: "100%",
    },
    clueChunk: {
      paddingVertical: responsive.scale(8),
      paddingHorizontal: responsive.scale(12),
      borderRadius: responsive.scale(8),
      marginBottom: spacing.small,
      backgroundColor: "transparent",
    },
    text: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(14),
      lineHeight: responsive.responsiveFontSize(20),
      color: colors.textPrimary,
    },
    wordCountText: {
      color: colors.primary,
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(11),
      textAlign: "right",
    },
  })
