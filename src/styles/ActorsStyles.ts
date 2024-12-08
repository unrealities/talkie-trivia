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
    maxWidth: responsive.scale(80),
    minHeight: responsive.scale(140),
  },
  actorPressable: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    padding: responsive.scale(4),
    width: "100%",
  },
  actorImage: {
    height: responsive.scale(90),
    width: responsive.scale(60),
    borderRadius: 4,
    resizeMode: "cover",
  },
  actorText: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(10),
    paddingTop: responsive.scale(4),
    textAlign: "center",
    color: colors.primary,
    width: responsive.scale(60),
    lineHeight: responsive.scale(12),
  },
})
