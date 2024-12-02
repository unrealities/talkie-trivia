import { StyleSheet, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

export const movieStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    marginTop: height * 0.03,
    width: width * 0.9,
    alignSelf: "center",
    maxWidth: 300,
  },
})
