import { StyleSheet, Dimensions } from "react-native"
import { colors } from "./global"

const { width, height } = Dimensions.get("window")

export const modalStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 20,
    borderWidth: 2,
    padding: 12,
    elevation: 2,
    minWidth: 120,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalView: {
    width: width * 0.9,
    maxWidth: 300,
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 20,
    elevation: 5,
    justifyContent: "space-between",
    margin: 8,
    maxHeight: height * 0.8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  buttonText: {
    color: colors.white,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  errorText: {
    color: colors.primary,
    fontFamily: "Arvo-Regular",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
})
