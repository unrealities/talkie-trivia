// src/utils/hooks/useMovieData.tsx
import { useState, useEffect } from "react"
import { Movie, BasicMovie } from "../../models/movie"
import { useAppContext } from "../../contexts/appContext"

const useMovieData = () => {
  const { state, dispatch } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("useMovieData: Loading movie data...")
        setLoading(true)

        const loadedMovies: Movie[] = require("../../../data/popularMovies.json")
        console.log("useMovieData: Loaded movies:", loadedMovies.length)
        const loadedBasicMovies: BasicMovie[] = require("../../../data/basicMovies.json")
        console.log(
          "useMovieData: Loaded basic movies:",
          loadedBasicMovies.length
        )

        // Dispatch actions to update the context state
        dispatch({ type: "SET_MOVIES", payload: loadedMovies })
        dispatch({ type: "SET_BASIC_MOVIES", payload: loadedBasicMovies })
      } catch (error) {
        console.error("useMovieData: Error caught:", error)
        setError(`useMovieData: Error loading movie data: ${error.message}`)
      } finally {
        console.log("useMovieData: Finally block executed.")
        setLoading(false)
      }
    }
    console.log("useMovieData: calling loadData")
    loadData()
  }, [dispatch])

  console.log("useMovieData: Rendering")
  return {
    movies: state.movies,
    basicMovies: state.basicMovies,
    loading,
    error,
  }
}

export default useMovieData
