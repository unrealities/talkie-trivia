import React from "react"
import { Slot } from "expo-router"
import { AppProvider } from "../contexts/appContext"
import ErrorBoundary from "../components/errorBoundary"

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Slot />
      </AppProvider>
    </ErrorBoundary>
  )
}
