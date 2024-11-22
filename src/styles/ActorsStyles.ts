import { StyleSheet } from "react-native"
import { colors } from "../styles/global"

export const actorsStyles = StyleSheet.create({
  actorsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    width: "100%",
  },
  actorContainer: {
    alignItems: "center",
    flex: 1,
    maxWidth: 80,
    minHeight: 140,
  },
  actorImage: {
    height: 90,
    width: 60,
    borderRadius: 4,
    resizeMode: "cover",
  },
  actorText: {
    fontFamily: "Arvo-Regular",
    fontSize: 10,
    paddingTop: 4,
    textAlign: "center",
    color: colors.primary,
    width: 60,
    lineHeight: 12,
  },
})
