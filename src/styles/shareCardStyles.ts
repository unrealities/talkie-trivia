import { StyleSheet } from "react-native"

export const getShareCardStyles = () =>
  StyleSheet.create({
    container: {
      width: 350,
      height: 600,
      backgroundColor: "#121212",
      borderRadius: 12,
      overflow: "hidden",
    },
    backgroundImage: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      padding: 24,
      justifyContent: "space-between",
      alignItems: "center",
    },
    header: {
      alignItems: "center",
    },
    title: {
      fontFamily: "Arvo-Bold",
      fontSize: 36,
      color: "#FFC107",
      textAlign: "center",
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
    },
    date: {
      fontFamily: "Arvo-Regular",
      fontSize: 18,
      color: "#FFFFFF",
      marginTop: 4,
    },
    resultsContainer: {
      backgroundColor: "rgba(20, 20, 20, 0.85)",
      borderRadius: 10,
      paddingVertical: 20,
      paddingHorizontal: 24,
      alignItems: "center",
      width: "100%",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    movieTitle: {
      fontFamily: "Arvo-Bold",
      fontSize: 24,
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 12,
    },
    resultLine: {
      fontFamily: "Arvo-Italic",
      fontSize: 20,
      color: "#A0A0A0",
      textAlign: "center",
      marginBottom: 20,
    },
    grid: {
      fontSize: 32,
      letterSpacing: 6,
    },
    footer: {
      alignItems: "center",
    },
    footerText: {
      fontFamily: "Arvo-Bold",
      fontSize: 18,
      color: "#FFC107",
    },
  })
