import React from "react"
import { Slot } from "expo-router"
import { AppProvider } from "../contexts/appContext"

export default function RootLayout() {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  )
}
