import { StyleSheet, Dimensions, Platform } from "react-native"
import { colors, responsive } from "./global"

const { width, height } = Dimensions.get("window")

export const modalStyles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    borderColor: colors.primary,
    borderRadius: responsive.scale(8),
    borderWidth: 2,
    padding: responsive.scale(10),
    elevation: 0,
    minWidth: responsive.isSmallScreen() ? "40%" : "30%",
    minHeight: responsive.scale(40),
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "none",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalView: {
    width: responsive.isTablet ? "75%" : "90%",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: responsive.scale(15),
    justifyContent: "space-between",
    margin: responsive.scale(10),
    minWidth: responsive.isSmallScreen()
      ? width * 0.85
      : responsive.isTablet
      ? width * 0.65
      : width * 0.8,
    maxHeight: responsive.isSmallScreen()
      ? height * 0.7
      : responsive.isTablet
      ? height * 0.8
      : height * 0.7,
    padding: responsive.scale(20),
    boxShadow: "none",
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
