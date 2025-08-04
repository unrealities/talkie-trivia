import { StyleSheet } from "react-native"
import { responsive } from "./global"

export const getNetworkStyles = (colors: any) =>
  StyleSheet.create({
    containerConnected: {
      display: "none",
    },
    containerNotConnected: {
      borderBottomColor: colors.error,
      borderBottomWidth: 2,
      borderTopColor: colors.error,
      borderTopWidth: 2,
      borderStyle: "solid",
      flex: 1,
      justifyContent: "center",
      paddingBottom: responsive.scale(6),
      paddingTop: responsive.scale(6),
      marginTop: responsive.scale(25),
      maxHeight: responsive.scale(80),
      minHeight: responsive.scale(25),
      alignSelf: "center",
      width: "100%",
      maxWidth: responsive.scale(500),
      marginBottom: responsive.scale(15),
      paddingVertical: responsive.scale(12),
    },
    connected: {
      color: colors.primary,
      flex: 1,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(22),
      marginTop: responsive.scale(8),
      textAlign: "center",
    },
    notConnected: {
      color: colors.error,
      flex: 1,
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(22),
      marginTop: responsive.scale(8),
      textAlign: "center",
    },
  })
