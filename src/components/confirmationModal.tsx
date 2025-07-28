import React, { memo } from "react"
import { Modal, Pressable, Text, View } from "react-native"
import { confirmationModalStyles } from "../styles/confirmationModalStyles"
import { hapticsService } from "../utils/hapticsService"

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
    const handleConfirm = () => {
      hapticsService.heavy()
      onConfirm()
    }
    const handleCancel = () => {
      hapticsService.light()
      onCancel()
    }

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={handleCancel}
      >
        {isVisible && (
          <View
            style={confirmationModalStyles.centeredView}
            testID="confirmation-modal-container"
          >
            <View style={confirmationModalStyles.modalView}>
              <Text style={confirmationModalStyles.title}>{title}</Text>
              <Text style={confirmationModalStyles.message}>{message}</Text>
              <View style={confirmationModalStyles.buttonContainer}>
                <Pressable
                  style={({ pressed }) => [
                    confirmationModalStyles.button,
                    confirmationModalStyles.cancelButton,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={handleCancel}
                >
                  <Text style={confirmationModalStyles.cancelButtonText}>
                    {cancelText}
                  </Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    confirmationModalStyles.button,
                    confirmationModalStyles.confirmButton,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={handleConfirm}
                >
                  <Text style={confirmationModalStyles.confirmButtonText}>
                    {confirmText}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </Modal>
    )
  }
)

export default ConfirmationModal
