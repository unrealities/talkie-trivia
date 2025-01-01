import React from "react"
import { Tabs } from "expo-router"
import { colors } from "../styles/global"
import { AppProvider } from "../contexts/appContext"

const Layout = () => {
  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarLabelStyle: { fontFamily: "Arvo-Bold", fontSize: 16 },
        }}
      >
        <Tabs.Screen
          name="game"
          options={{
            title: "Game",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Tabs>
    </AppProvider>
  )
}

export default Layout
