import { Alert } from "react-native"

export function handleError(error, context) {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred."
  console.error(`${context}: ${errorMessage}`)
  Alert.alert("Error", errorMessage)
}
