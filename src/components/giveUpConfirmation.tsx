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
    console.log("handleConfirmation called. isVisible:", isVisibleRef.current)
    Alert.alert(
      "Give Up?",
      "Are you sure you want to give up on this movie?",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel pressed")
            onCancel()
          },
          style: "cancel",
        },
        {
          text: "Give Up",
          onPress: () => {
            console.log("Give Up pressed")
            onConfirm()
          },
        },
      ],
      { cancelable: false }
    )
  }, [onCancel, onConfirm])

  useEffect(() => {
    console.log("GiveUpConfirmation useEffect. isVisible:", isVisible)
    if (isVisible) {
      handleConfirmation()
    }
  }, [isVisible, handleConfirmation])

  return null
}

export default GiveUpConfirmation
