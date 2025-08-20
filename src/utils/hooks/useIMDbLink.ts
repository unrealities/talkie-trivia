import { useCallback } from "react"
import { Alert } from "react-native"
import * as Linking from "expo-linking"
import { API_CONFIG } from "../../config/constants"

type IMDbLinkType = "name" | "title"

/**
 * A reusable hook to handle opening IMDb links for actors or movies.
 * It encapsulates the logic for URL construction, availability checks, and error handling.
 *
 * @returns A stable function `openLink` that can be called to trigger the action.
 */
export function useIMDbLink() {
  const openLink = useCallback(
    async (imdbId: string | null | undefined, type: IMDbLinkType) => {
      if (!imdbId) {
        Alert.alert(
          "IMDb Link Unavailable",
          `No link was found for this ${type === "name" ? "person" : "movie"}.`
        )
        return
      }

      const baseURL =
        type === "name"
          ? API_CONFIG.IMDB_BASE_URL_NAME
          : API_CONFIG.IMDB_BASE_URL_TITLE
      const url = `${baseURL}${imdbId}`

      try {
        const supported = await Linking.canOpenURL(url)
        if (supported) {
          await Linking.openURL(url)
        } else {
          Alert.alert("Unsupported Link", "Unable to open the IMDb page.")
        }
      } catch (error: any) {
        console.error("Failed to open IMDb link:", error)
        Alert.alert(
          "Link Error",
          `Could not open the IMDb link: ${error.message}`
        )
      }
    },
    []
  )

  return { openLink }
}
