import { useState, useCallback, useEffect } from "react"
import * as Network from "expo-network"
import * as SplashScreen from "expo-splash-screen"
import { useFonts } from "expo-font"

export const useResourceLoading = () => {
  const [isAppReady, setIsAppReady] = useState(false)
  const [isNetworkConnected, setIsNetworkConnected] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  let [fontsLoaded] = useFonts({
    "Arvo-Bold": require("../../../assets/fonts/Arvo-Bold.ttf"),
    "Arvo-Regular": require("../../../assets/fonts/Arvo-Regular.ttf"),
  })

  const loadResources = useCallback(async () => {
    try {
      const networkState = await Network.getNetworkStateAsync()
      const isConnected = networkState.isInternetReachable ?? false

      setIsNetworkConnected(isConnected)

      if (fontsLoaded && isConnected) {
        setIsAppReady(true)
        await SplashScreen.hideAsync()
      } else if (!isConnected) {
        setLoadingError("No internet connection. Please check your network.")
      }
    } catch (error) {
      console.error("Resource loading error:", error)
      setLoadingError("Error loading resources. Please try again.")
    }
  }, [fontsLoaded])

  const retryLoadResources = async () => {
    setLoadingError(null)
    await loadResources()
  }

  useEffect(() => {
    loadResources()
  }, [loadResources])

  return {
    isAppReady,
    isNetworkConnected,
    loadingError,
    retryLoadResources,
  }
}
