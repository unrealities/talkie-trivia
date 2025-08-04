import React, { memo, useMemo } from "react"
import { Modal, Pressable, Text, View } from "react-native"
import { getConfirmationModalStyles } from "../styles/confirmationModalStyles"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"

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
    const { colors } = useTheme()
    const styles = useMemo(() => getConfirmationModalStyles(colors), [colors])

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
            style={styles.centeredView}
            testID="confirmation-modal-container"
          >
            <View style={styles.modalView}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.cancelButton,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.confirmButton,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
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
