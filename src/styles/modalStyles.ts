import { StyleSheet, Dimensions, Platform } from "react-native"
import { colors, responsive } from "./global"

const { width, height } = Dimensions.get("window")

export const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalView: {
    width: "90%",
    maxHeight: "70%",
    maxWidth: responsive.scale(500),
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: responsive.scale(15),
    padding: responsive.scale(20),
    boxShadow: "none",
    marginTop: responsive.scale(120),
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: responsive.scale(15),
  },

  button: {
    backgroundColor: "transparent",
    borderColor: colors.secondary,
    borderRadius: responsive.scale(8),
    borderWidth: 2,
    paddingVertical: responsive.scale(10),
    paddingHorizontal: responsive.scale(20),
    minHeight: responsive.scale(40),
    justifyContent: "center",
    alignItems: "center",
  },

  shareButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: responsive.scale(8),
    borderWidth: 2,
    paddingVertical: responsive.scale(10),
    paddingHorizontal: responsive.scale(20),
    minHeight: responsive.scale(40),
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
    fontSize: responsive.responsiveFontSize(16),
    letterSpacing: 0.5,
  },

  errorText: {
    color: colors.quaternary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(18),
    textAlign: "center",
    marginBottom: responsive.scale(20),
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
})
