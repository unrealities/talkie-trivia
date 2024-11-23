import { StyleSheet } from "react-native"
import { colors } from "./global"

export const modalStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 20,
    borderWidth: 4,
    padding: 12,
    elevation: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 20,
    elevation: 5,
    justifyContent: "space-evenly",
    margin: 8,
    maxHeight: "80%",
    padding: 16,
  },
  buttonText: {
    color: colors.white,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
  },
})
