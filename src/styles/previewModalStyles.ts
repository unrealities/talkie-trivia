import { StyleSheet } from "react-native"
import { responsive, spacing } from "./global"

export const getPreviewModalStyles = (colors: any) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
    modalView: {
      width: responsive.scale(280),
      backgroundColor: colors.surface,
      borderRadius: responsive.scale(15),
      padding: spacing.medium,
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    posterImage: {
      width: "100%",
      height: responsive.scale(300),
      borderRadius: responsive.scale(10),
      marginBottom: spacing.medium,
      backgroundColor: colors.background,
    },
    infoContainer: {
      alignItems: "center",
      width: "100%",
      marginBottom: spacing.large,
    },
    titleText: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(18),
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: spacing.small,
    },
    dateText: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(14),
      color: colors.textSecondary,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: spacing.small,
    },
    submitButton: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.small,
      paddingHorizontal: spacing.medium,
      borderRadius: responsive.scale(8),
      flex: 1,
      marginLeft: spacing.small,
      alignItems: "center",
    },
    submitButtonText: {
      color: colors.background,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(14),
    },
    closeButton: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.border,
      paddingVertical: spacing.small,
      paddingHorizontal: spacing.medium,
      borderRadius: responsive.scale(8),
      flex: 1,
      marginRight: spacing.small,
      alignItems: "center",
    },
    closeButtonText: {
      color: colors.textPrimary,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(14),
    },
  })
