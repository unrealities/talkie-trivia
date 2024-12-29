import React from "react"
import { Tabs } from "expo-router"
import { colors } from "../styles/global"

const Layout = () => {
  return (
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
  )
}

export default Layout
