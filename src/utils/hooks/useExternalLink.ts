// src/utils/hooks/useExternalLink.ts

import { useCallback } from "react"
import { Alert } from "react-native"
import * as Linking from "expo-linking"

/**
 * A reusable hook to handle opening any external URL.
 * It encapsulates link availability checks and error handling.
 */
export function useExternalLink() {
  const openLink = useCallback(async (url: string | null | undefined) => {
    if (!url) {
      Alert.alert("Link Unavailable", "No link was found for this item.")
      return
    }

    try {
      const supported = await Linking.canOpenURL(url)
      if (supported) {
        await Linking.openURL(url)
      } else {
        Alert.alert("Unsupported Link", `Unable to open this link: ${url}`)
      }
    } catch (error: any) {
      console.error("Failed to open external link:", error)
      Alert.alert("Link Error", `Could not open the link: ${error.message}`)
    }
  }, [])

  return { openLink }
}
