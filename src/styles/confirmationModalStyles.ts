import { StyleSheet } from "react-native"
import { colors, responsive } from "./global"

export const confirmationModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: colors.background,
    borderRadius: responsive.scale(10),
    padding: responsive.scale(20),
    width: "80%",
    maxWidth: responsive.scale(400),
  },
  title: {
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(20),
    marginBottom: responsive.scale(10),
    textAlign: "center",
    color: colors.secondary,
  },
  message: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(16),
    marginBottom: responsive.scale(20),
    textAlign: "center",
    color: colors.secondary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    borderRadius: responsive.scale(5),
    padding: responsive.scale(10),
    elevation: 2,
    minWidth: responsive.scale(100),
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderColor: colors.quaternary,
    borderWidth: 2,
  },
  confirmButtonText: {
    color: colors.secondary,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
  },
  cancelButtonText: {
    color: colors.quaternary,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
  },
})
