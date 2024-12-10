import { StyleSheet, Dimensions } from "react-native"
import { responsive } from "./global"

const { width, height } = Dimensions.get("window")

export const movieStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    marginTop: height * 0.03,
    width: "90%",
    alignSelf: "center",
    maxWidth: responsive.scale(300),
  },
})
