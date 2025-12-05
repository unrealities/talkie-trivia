import React, { memo } from "react"
import { Modal, View, ViewStyle, TextStyle } from "react-native"
import { hapticsService } from "../utils/hapticsService"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Button } from "./ui/button"
import { Typography } from "./ui/typography"

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
    const styles = useStyles(themedStyles)

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
              <Typography variant="h2" style={styles.title}>
                {title}
              </Typography>

              <Typography variant="body" style={styles.message}>
                {message}
              </Typography>

              <View style={styles.buttonContainer}>
                <Button
                  title={cancelText}
                  variant="secondary"
                  onPress={handleCancel}
                  style={styles.button}
                />
                <Button
                  title={confirmText}
                  variant="primary"
                  onPress={handleConfirm}
                  style={styles.button}
                />
              </View>
            </View>
          </View>
        )}
      </Modal>
    )
  }
)

interface ModalStyles {
  centeredView: ViewStyle
  modalView: ViewStyle
  title: TextStyle
  message: TextStyle
  buttonContainer: ViewStyle
  button: ViewStyle
}

const themedStyles = (theme: Theme): ModalStyles => ({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.responsive.scale(10),
    padding: theme.responsive.scale(20),
    width: "80%",
    maxWidth: theme.responsive.scale(400),
    ...theme.shadows.medium,
  },
  title: {
    fontSize: theme.responsive.responsiveFontSize(20),
    marginBottom: theme.spacing.small,
    textAlign: "center",
  },
  message: {
    marginBottom: theme.spacing.large,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.small,
  },
})

export default ConfirmationModal
