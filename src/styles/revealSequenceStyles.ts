import { StyleSheet } from "react-native"
import { responsive, shadows } from "./global"

export const getRevealSequenceStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    },
    poster: {
      width: responsive.scale(180),
      height: responsive.scale(270),
      borderRadius: responsive.scale(10),
      ...shadows.medium,
    },
    title: {
      fontFamily: "Arvo-Bold",
      fontSize: responsive.responsiveFontSize(24),
      color: colors.primary,
      textAlign: "center",
      marginTop: responsive.scale(20),
      paddingHorizontal: responsive.scale(10),
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
  })
