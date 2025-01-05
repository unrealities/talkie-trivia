import React, { useEffect, useState } from "react"
import { Tabs, useSegments, Redirect } from "expo-router"
import { useAuthentication } from "../utils/hooks/useAuthentication"
import useMovieData from "../utils/hooks/useMovieData"
import usePlayerData from "../utils/hooks/usePlayerData"
import LoadingIndicator from "../components/loadingIndicator"
import ErrorMessage from "../components/errorMessage"
import { colors } from "../styles/global"

const InitializedLayout = () => {
  const [authLoading, setAuthLoading] = useState(false)
  const [movies, setMovies] = useState([])
  const [basicMovies, setBasicMovies] = useState([])
  const [playerData, setPlayerData] = useState(null)

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
      initializePlayer()
    }
  }, [authLoading, initializePlayer])

  if (movieDataLoading || playerDataLoading) {
    return <LoadingIndicator />
  }

  if (movieDataError) {
    return <ErrorMessage message={movieDataError} />
  }

  if (playerDataError) {
    return <ErrorMessage message={playerDataError} />
  }

  if (!movies.length || !basicMovies.length) {
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
