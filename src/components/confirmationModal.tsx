import React, { memo } from "react"
import { Modal, Pressable, Text, View } from "react-native"
import { confirmationModalStyles } from "../styles/confirmationModalStyles"

interface ConfirmationModalProps {
  isVisible: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationModal = memo(
  ({
    isVisible,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
  }: ConfirmationModalProps) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onCancel}
      >
        <View style={confirmationModalStyles.centeredView}>
          <View style={confirmationModalStyles.modalView}>
            <Text style={confirmationModalStyles.title}>{title}</Text>
            <Text style={confirmationModalStyles.message}>{message}</Text>
            <View style={confirmationModalStyles.buttonContainer}>
              <Pressable
                style={[
                  confirmationModalStyles.button,
                  confirmationModalStyles.cancelButton,
                ]}
                onPress={onCancel}
              >
                <Text style={confirmationModalStyles.cancelButtonText}>
                  {cancelText}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  confirmationModalStyles.button,
                  confirmationModalStyles.confirmButton,
                ]}
                onPress={onConfirm}
              >
                <Text style={confirmationModalStyles.confirmButtonText}>
                  {confirmText}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
)

export default ConfirmationModal
