import React, { useEffect, useState } from "react"
import { Tabs, useRouter } from "expo-router"
import { useAuthentication } from "../../utils/hooks/useAuthentication"
import useMovieData from "../../utils/hooks/useMovieData"
import usePlayerData from "../../utils/hooks/usePlayerData"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { colors } from "../../styles/global"

const TabLayout = () => {
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()

  const { authLoading: authLoadingState } = useAuthentication()

  useEffect(() => {
    setAuthLoading(authLoadingState)
  }, [authLoadingState])

  const {
    movies: movieData,
    basicMovies: basicMoviesData,
    loading: movieDataLoading,
    error: movieDataError,
  } = useMovieData()

  const {
    loading: playerDataLoading,
    error: playerDataError,
    initializePlayer,
  } = usePlayerData()

  useEffect(() => {
    if (!authLoading) {
      console.log("TabLayout: Auth is loaded, initializing player.")
      initializePlayer()
    }
  }, [authLoading, initializePlayer])

  useEffect(() => {
    // Combined loading check
    if (authLoading || movieDataLoading || playerDataLoading) {
      console.log("TabLayout: Loading...")
      return // Exit if still loading
    }

    if (movieDataError) {
      console.log("TabLayout: Error: movieDataError:", movieDataError)
      return
    }

    if (playerDataError) {
      console.log("TabLayout: Error: playerDataError:", playerDataError)
      return
    }

    if (!movieData || !basicMoviesData) {
      console.log(
        "TabLayout: Error: Movies data not loaded:",
        movieData,
        basicMoviesData
      )
      return
    }

    if (!movieData.length || !basicMoviesData.length) {
      console.log(
        "TabLayout: Error: Movies data is empty:",
        movieData,
        basicMoviesData
      )
      return
    }

    console.log("TabLayout: Navigation to Game Screen")
    router.replace("/game")
  }, [
    authLoading,
    movieData,
    basicMoviesData,
    movieDataLoading,
    playerDataLoading,
    movieDataError,
    playerDataError,
    router,
  ])

  if (authLoading || movieDataLoading || playerDataLoading) {
    console.log("TabLayout: Loading...")
    return <LoadingIndicator />
  }

  if (movieDataError) {
    console.log("TabLayout: Error: movieDataError:", movieDataError)
    return <ErrorMessage message={movieDataError} />
  }

  if (playerDataError) {
    console.log("TabLayout: Error: playerDataError:", playerDataError)
    return <ErrorMessage message={playerDataError} />
  }

  if (!movieData || !basicMoviesData) {
    console.log(
      "TabLayout: Error: Movies data not loaded:",
      movieData,
      basicMoviesData
    )
    return <ErrorMessage message={"Missing movie data"} />
  }

  if (!movieData.length || !basicMoviesData.length) {
    console.log(
      "TabLayout: Error: Movies data is empty:",
      movieData,
      basicMoviesData
    )
    return <ErrorMessage message={"Missing movie data"} />
  }
  console.log("TabLayout: InitializedLayout: Rendering Tabs")
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

export default TabLayout
