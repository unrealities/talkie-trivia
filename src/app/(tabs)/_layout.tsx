import React from "react"
import { Tabs } from "expo-router"
import { colors } from "../../styles/global"
import { useFonts } from "expo-font"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"

const TabLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Arvo-Bold": require("../../../assets/fonts/Arvo-Bold.ttf"),
    "Arvo-Italic": require("../../../assets/fonts/Arvo-Italic.ttf"),
    "Arvo-Regular": require("../../../assets/fonts/Arvo-Regular.ttf"),
  })

  if (!fontsLoaded) {
    return <LoadingIndicator />
  }

  if (fontError) {
    return <ErrorMessage message={fontError.message} />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarLabelStyle: {
          fontFamily: "Arvo-Bold",
          fontSize: 16,
          margin: 0, // Remove default margin
          padding: 0, // Remove default padding
        },
        tabBarIconStyle: {
          display: "none", // Hide the tab icons (the arrows)
        },
        tabBarLabelPosition: "beside-icon", // Ensure labels are displayed beside the icon space (even though the icon is hidden)
        tabBarStyle: {
          paddingHorizontal: 100,
        },
      }}
      initialRouteName="game"
    >
      <Tabs.Screen name="game" options={{ title: "Game" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      {/* Hide the index route from the tab bar */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}

export default TabLayout
