import { useState, useEffect, useCallback } from "react"
import { Movie, BasicMovie } from "../../models/movie"
import { useAppContext } from "../../contexts/appContext"

import popularMoviesData from "../../../data/popularMovies.json"
import basicMoviesData from "../../../data/basicMovies.json"

const useMovieData = () => {
  console.log("useMovieData: Hook function called")
  const { state, dispatch } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true) // Set loading to true *before* fetch
    dispatch({ type: "SET_IS_LOADING", payload: true })
    try {
      console.log("useMovieData: Fetching movie data...")
      setLoadError(null)

      // Log the data received:
      console.log("useMovieData: Received movie data:", popularMoviesData)
      console.log("useMovieData: Received basic movie data:", basicMoviesData)

      const loadedMovies: Movie[] = popularMoviesData
      const loadedBasicMovies: BasicMovie[] = basicMoviesData

      // Validate that data is loaded correctly
      if (!Array.isArray(loadedMovies) || loadedMovies.length === 0) {
        throw new Error("Invalid or empty movie data received.")
      }
      if (!Array.isArray(loadedBasicMovies) || loadedBasicMovies.length === 0) {
        throw new Error("Invalid or empty basic movie data received.")
      }

      console.log("useMovieData: Data validation successful")
      dispatch({ type: "SET_MOVIES", payload: loadedMovies })
      console.log("useMovieData: Dispatched SET_MOVIES action")

      dispatch({ type: "SET_BASIC_MOVIES", payload: loadedBasicMovies })
      console.log("useMovieData: Dispatched SET_BASIC_MOVIES action")
    } catch (error: any) {
      console.error("useMovieData: Error loading movie data:", error) // Log the full error object
      setLoadError(`useMovieData: Error loading movie data: ${error.message}`)
      dispatch({
        type: "SET_DATA_LOADING_ERROR",
        payload: `useMovieData: Error loading movie data: ${error.message}`,
      })
    } finally {
      console.log("useMovieData: Setting Loading to false")
      setLoading(false) // Set loading to false in the finally block
      dispatch({ type: "SET_IS_LOADING", payload: false })
    }
  }, [dispatch])

  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    movies: state.movies,
    basicMovies: state.basicMovies,
    loading,
    error: loadError,
  }
}

export default useMovieData
