import React from "react"
import { Tabs } from "expo-router"
import { useFonts } from "expo-font"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { FontAwesome } from "@expo/vector-icons"
import { useTheme } from "../../contexts/themeContext"

const TabLayout = () => {
  const { colors } = useTheme()

  const [fontsLoaded, fontError] = useFonts({
    "Arvo-Bold": require("../../../assets/fonts/Arvo-Bold.ttf"),
    "Arvo-Italic": require("../../../assets/fonts/Arvo-Italic.ttf"),
    "Arvo-Regular": require("../../../assets/fonts/Arvo-Regular.ttf"),
    ...FontAwesome.font,
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
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarActiveBackgroundColor: colors.surface,
        tabBarItemStyle: {
          marginVertical: 5,
          marginHorizontal: 10,
          borderRadius: 10,
          paddingVertical: 5,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarLabelStyle: {
          fontFamily: "Arvo-Bold",
          fontSize: 16,
          margin: 0,
          padding: 0,
        },
        tabBarIconStyle: {
          display: "none",
        },
        tabBarStyle: {
          paddingHorizontal: 20,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
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
