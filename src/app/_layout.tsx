import React, { useEffect } from "react"
import { Tabs, useSegments, Redirect } from "expo-router"

import { useAuthentication } from "../utils/hooks/useAuthentication"
import useMovieData from "../utils/hooks/useMovieData"
import usePlayerData from "../utils/hooks/usePlayerData"
import LoadingIndicator from "../components/loadingIndicator"
import ErrorMessage from "../components/errorMessage"
import { colors } from "../styles/global"
import { useAppContext } from "../contexts/appContext"

const InitializedLayout = () => {
  console.log("InitializedLayout: START")

  console.log("InitializedLayout: Calling useAuthentication")
  const { authLoading } = useAuthentication()
  console.log(
    "InitializedLayout: useAuthentication returned, authLoading:",
    authLoading
  )

  console.log("InitializedLayout: Calling useMovieData")
  const {
    movies,
    basicMovies,
    loading: movieDataLoading,
    error: movieDataError,
  } = useMovieData()
  console.log(
    "InitializedLayout: useMovieData returned, movieDataLoading:",
    movieDataLoading
  )

  console.log("InitializedLayout: Calling usePlayerData")
  const {
    loading: playerDataLoading,
    error: playerDataError,
    initializePlayer,
  } = usePlayerData()
  console.log(
    "InitializedLayout: usePlayerData returned, playerDataLoading:",
    playerDataLoading
  )

  console.log("InitializedLayout: Calling useSegments")
  const segments = useSegments()
  console.log("InitializedLayout: useSegments returned")

  useEffect(() => {
    console.log("InitializedLayout: useEffect: authLoading:", authLoading)
    if (!authLoading) {
      console.log("InitializedLayout: useEffect: Calling initializePlayer")
      initializePlayer()
    }
  }, [authLoading, initializePlayer])

  if (authLoading || movieDataLoading || playerDataLoading) {
    console.log("InitializedLayout: Loading state is true")
    return <LoadingIndicator />
  }

  if (movieDataError) {
    console.log("InitializedLayout: movieDataError:", movieDataError)
    return <ErrorMessage message={"Error loading movie data"} />
  }

  if (playerDataError) {
    console.log("InitializedLayout: playerDataError:", playerDataError)
    return <ErrorMessage message={"Error loading player data"} />
  }

  if (!movies.length || !basicMovies.length) {
    console.log("InitializedLayout: Missing movie data")
    return <ErrorMessage message={"Missing movie data"} />
  }

  console.log("InitializedLayout: Rendering Tabs")
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

export default InitializedLayout
