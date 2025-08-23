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
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      padding: 20,
      justifyContent: "space-between",
      alignItems: "center",
    },
    header: {
      alignItems: "center",
    },
    title: {
      fontFamily: "Arvo-Bold",
      fontSize: 32,
      color: "#FFC107",
      textAlign: "center",
    },
    date: {
      fontFamily: "Arvo-Regular",
      fontSize: 16,
      color: "#FFFFFF",
      marginTop: 4,
    },
    resultsContainer: {
      backgroundColor: "rgba(42, 42, 42, 0.85)",
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      width: "100%",
    },
    movieTitle: {
      fontFamily: "Arvo-Bold",
      fontSize: 22,
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 12,
    },
    resultLine: {
      fontFamily: "Arvo-Italic",
      fontSize: 18,
      color: "#A0A0A0",
      textAlign: "center",
      marginBottom: 16,
    },
    grid: {
      fontSize: 28,
      letterSpacing: 4,
    },
    footer: {
      alignItems: "center",
    },
    footerText: {
      fontFamily: "Arvo-Bold",
      fontSize: 16,
      color: "#FFC107",
    },
  })
