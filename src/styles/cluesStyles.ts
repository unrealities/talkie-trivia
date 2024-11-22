import { StyleSheet } from "react-native"
import { colors } from "../styles/global"

export const cluesStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginVertical: 10,
    minWidth: 300,
    minHeight: 250,
  },
  countContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
    maxHeight: 16,
    justifyContent: "flex-end",
  },
  textContainer: {
    flexWrap: "wrap",
    maxWidth: 300,
    minWidth: 280,
    textAlign: "left",
    paddingHorizontal: 10,
  },
  text: {
    color: colors.secondary,
    fontFamily: "Arvo-Regular",
    fontSize: 16,
    paddingBottom: 4,
  },
  wordCountText: {
    color: colors.primary,
    fontFamily: "Arvo-Regular",
    fontSize: 10,
    textAlign: "right",
  },
})
