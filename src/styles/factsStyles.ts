import { StyleSheet } from "react-native"

export const factsStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 10,
    width: 260,
  },
  header: {
    flexWrap: "wrap",
    fontFamily: "Arvo-Bold",
    fontSize: 24,
    paddingBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
    width: "100%",
    flexGrow: 1,
  },
  posterImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 2 / 3,
    marginBottom: 10,
    borderRadius: 6,
  },
  subHeader: {
    fontFamily: "Arvo-Italic",
    fontSize: 14,
    textAlign: "center",
    width: "90%",
    marginBottom: 10,
    color: "#666",
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: 14,
    paddingTop: 10,
    textAlign: "center",
    marginBottom: 10,
    color: "#444",
  },
})
