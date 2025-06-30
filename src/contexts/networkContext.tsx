import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import * as Network from "expo-network"

interface NetworkState {
  isNetworkConnected: boolean
}

const NetworkContext = createContext<NetworkState | undefined>(undefined)

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isNetworkConnected, setIsNetworkConnected] = useState(true)

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync()
      setIsNetworkConnected(state.isInternetReachable ?? false)
    }

    checkNetwork()
    const subscription = Network.addNetworkStateListener((state) => {
      setIsNetworkConnected(state.isInternetReachable ?? false)
    })

    return () => {
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
