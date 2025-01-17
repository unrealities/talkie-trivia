import React from "react"
import { Tabs } from "expo-router"
import { colors } from "../../styles/global"
import { useFonts } from "expo-font"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { AppProvider } from "../../contexts/appContext"

const TabLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Arvo-Bold": require("../../../assets/fonts/Arvo-Bold.ttf"),
    "Arvo-Italic": require("../../../assets/fonts/Arvo-Italic.ttf"),
    "Arvo-Regular": require("../../../assets/fonts/Arvo-Regular.ttf"),
  })

  if (!fontsLoaded) {
    console.log("fonts not loaded")
    return <LoadingIndicator />
  }

  if (fontError) {
    return <ErrorMessage message={fontError.message} />
  }

  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarLabelStyle: { fontFamily: "Arvo-Bold", fontSize: 16 },
        }}
      >
        <Tabs.Screen name="game" options={{ title: "Game" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </AppProvider>
  )
}

export default TabLayout
