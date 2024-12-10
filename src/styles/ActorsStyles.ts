import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const actorsStyles = StyleSheet.create({
  actorsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: responsive.scale(12),
    width: "100%",
  },
  actorContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: responsive.scale(5),
    minHeight: responsive.scale(140),
  },
  actorPressable: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: responsive.scale(4),
    padding: responsive.scale(4),
    width: "100%",
  },
  actorImage: {
    height: responsive.scale(90),
    width: "100%",
    aspectRatio: 1 / 1.5,
    borderRadius: responsive.scale(4),
    resizeMode: "cover",
  },
  actorText: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(10),
    paddingTop: responsive.scale(4),
    textAlign: "center",
    color: colors.primary,
    width: "100%",
    lineHeight: responsive.responsiveFontSize(12),
  },
})
