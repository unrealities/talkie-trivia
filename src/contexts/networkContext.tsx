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
  isNetworkConnected: boolean | null
}

const NetworkContext = createContext<NetworkState | undefined>(undefined)

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isNetworkConnected, setIsNetworkConnected] = useState<boolean | null>(
    null
  )

  useEffect(() => {
    let mounted = true

    const checkNetwork = async () => {
      try {
        const state = await Network.getNetworkStateAsync()
        if (mounted) {
          const isConnected = state.isInternetReachable ?? false
          setIsNetworkConnected(isConnected)
          // Track initial status
          analyticsService.trackNetworkStatusChange(isConnected)
        }
      } catch (error) {
        console.error("NetworkContext: Failed to get network state.", error)
        if (mounted) {
          setIsNetworkConnected(false)
        }
      }
    }

    checkNetwork()

    const subscription = Network.addNetworkStateListener((state) => {
      if (mounted) {
        const isConnected = state.isInternetReachable ?? false
        setIsNetworkConnected((prev) => {
          if (prev !== isConnected) {
            analyticsService.trackNetworkStatusChange(isConnected)
          }
          return isConnected
        })
      }
    })

    return () => {
      mounted = false
      subscription.remove()
    }
  }, [])

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
