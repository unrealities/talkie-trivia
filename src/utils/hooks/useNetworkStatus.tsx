import { useState, useEffect } from "react"
import * as Network from "expo-network"
import { useAppContext } from "../../contexts/appContext"

const useNetworkStatus = () => {
  const { dispatch } = useAppContext()
  const [isNetworkConnected, setIsNetworkConnected] = useState(true) // Add a local state

  useEffect(() => {
    const updateNetworkStatus = async () => {
      const networkState = await Network.getNetworkStateAsync()
      const connected = networkState.isInternetReachable ?? false
      setIsNetworkConnected(connected) // Update local state
      dispatch({ type: "SET_NETWORK_CONNECTED", payload: connected })
    }

    updateNetworkStatus()
  }, [dispatch])

  return { isNetworkConnected } // Return the local state
}

export default useNetworkStatus
