import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import * as Network from "expo-network"
import { analyticsService } from "../utils/analyticsService"

interface NetworkState {
  isNetworkConnected: boolean
}

const NetworkContext = createContext<NetworkState | undefined>(undefined)

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isNetworkConnected, setIsNetworkConnected] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync()
      const isConnected = state.isInternetReachable ?? false
      if (mounted) {
        setIsNetworkConnected(isConnected)
        analyticsService.trackNetworkStatusChange(isConnected)
      }
    }

    checkNetwork()
    const subscription = Network.addNetworkStateListener((state) => {
      if (mounted) {
        const isConnected = state.isInternetReachable ?? false
        // Only track if the state actually changed
        if (isConnected !== isNetworkConnected) {
          setIsNetworkConnected(isConnected)
          analyticsService.trackNetworkStatusChange(isConnected)
        }
      }
    })

    return () => {
      mounted = false
      subscription.remove()
    }
  }, [isNetworkConnected])

  const value = { isNetworkConnected }

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  )
}

export const useNetwork = () => {
  const context = useContext(NetworkContext)
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider")
  }
  return context
}
