import { StyleSheet, Dimensions, Platform } from "react-native"
import { colors, responsive } from "./global"

const { width, height } = Dimensions.get("window")

export const modalStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: responsive.scale(10), // Reduced from 20
    borderWidth: 2,
    padding: responsive.scale(8), // Reduced padding
    elevation: 2,
    minWidth: responsive.scale(80), // Reduced width
    minHeight: responsive.scale(40), // Reduced height
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
    width: responsive.isTablet ? width * 0.6 : width * 0.9,
    maxWidth: responsive.scale(400),
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: responsive.scale(20),
    justifyContent: "space-between",
    margin: responsive.scale(8),
    maxHeight: height * 0.8,
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
    fontSize: responsive.responsiveFontSize(14), // Reduced font size
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
