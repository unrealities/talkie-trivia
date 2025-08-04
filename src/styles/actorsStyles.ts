import { StyleSheet } from "react-native"
import { responsive } from "./global"

export const getActorsStyles = (colors: any) =>
  StyleSheet.create({
    actorsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: responsive.scale(2),
      width: "100%",
    },
    actorContainer: {
      alignItems: "center",
      flex: 1,
      marginHorizontal: responsive.scale(5),
      minHeight: responsive.scale(180),
      position: "relative",
    },
    actorPressable: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: responsive.scale(4),
      padding: responsive.scale(2),
      width: "100%",
      backgroundColor: colors.background,
    },
    actorImage: {
      height: responsive.scale(120),
      width: "100%",
      aspectRatio: 1 / 1.5,
      borderRadius: responsive.scale(4),
      resizeMode: "cover",
    },
    actorTextContainer: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      minHeight: responsive.scale(40),
      flexWrap: "wrap",
    },
    actorTextBackground: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      paddingHorizontal: responsive.scale(2),
      marginTop: responsive.scale(10),
      width: "100%",
    },
    actorText: {
      fontFamily: "Arvo-Regular",
      fontSize: responsive.responsiveFontSize(8),
      color: colors.secondary,
      textAlign: "center",
      lineHeight: responsive.responsiveFontSize(10),
      paddingVertical: responsive.scale(2),
    },
  })
