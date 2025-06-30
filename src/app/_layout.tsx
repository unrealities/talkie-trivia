import React from "react"
import { Slot } from "expo-router"
import ErrorBoundary from "../components/errorBoundary"
import { NetworkProvider } from "../contexts/networkContext"
import { AssetsProvider } from "../contexts/assetsContext"
import { AuthProvider } from "../contexts/authContext"
import { GameDataProvider } from "../contexts/gameDataContext"

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <NetworkProvider>
        <AssetsProvider>
          <AuthProvider>
            <GameDataProvider>
              <Slot />
            </GameDataProvider>
          </AuthProvider>
        </AssetsProvider>
      </NetworkProvider>
    </ErrorBoundary>
  )
}
