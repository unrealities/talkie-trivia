import { StyleSheet, Dimensions, Platform } from "react-native"
import { colors, responsive } from "./global"

const { width, height } = Dimensions.get("window")

export const modalStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: responsive.scale(10),
    borderWidth: 2,
    padding: responsive.scale(8),
    elevation: 2,
    minWidth: responsive.isSmallScreen() ? "40%" : "30%",
    minHeight: responsive.scale(40),
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalView: {
    width: responsive.isTablet ? "80%" : "95%",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: responsive.scale(20),
    justifyContent: "space-between",
    margin: responsive.scale(8),
    minWidth: responsive.isSmallScreen()
      ? width * 0.85
      : responsive.isTablet
      ? width * 0.7
      : width * 0.85,
    maxHeight: responsive.isSmallScreen()
      ? height * 0.6
      : responsive.isTablet
      ? height * 0.75
      : height * 0.7,
    padding: responsive.scale(16),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  buttonText: {
    color: colors.white,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
    fontSize: responsive.responsiveFontSize(14),
    letterSpacing: 0.5,
  },

  errorText: {
    color: colors.primary,
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(16),
    textAlign: "center",
    marginBottom: responsive.scale(15),
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
})
