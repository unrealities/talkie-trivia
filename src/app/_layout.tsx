import React from "react"
import { Slot, Redirect } from "expo-router"
import { AppProvider } from "../contexts/appContext"

export default function RootLayout() {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  )
}

export function RootLayoutNav() {
  return <Redirect href={"/game"} />
}
