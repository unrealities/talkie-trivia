import React, { useCallback, useEffect, useRef } from "react"
import { Alert } from "react-native"

interface GiveUpConfirmationProps {
  isVisible: boolean
  onConfirm: () => void
  onCancel: () => void
}

const GiveUpConfirmation: React.FC<GiveUpConfirmationProps> = ({
  isVisible,
  onConfirm,
  onCancel,
}) => {
  const isVisibleRef = useRef(isVisible)

  useEffect(() => {
    isVisibleRef.current = isVisible
  }, [isVisible])

  const handleConfirmation = useCallback(() => {
    Alert.alert(
      "Give Up?",
      "Are you sure you want to give up on this movie?",
      [
        {
          text: "Cancel",
          onPress: () => {
            onCancel()
          },
          style: "cancel",
        },
        {
          text: "Give Up",
          onPress: () => {
            onConfirm()
          },
        },
      ],
      { cancelable: false }
    )
  }, [onCancel, onConfirm])

  useEffect(() => {
    if (isVisible) {
      handleConfirmation()
    }
  }, [isVisible, handleConfirmation])

  return null
}

export default GiveUpConfirmation
