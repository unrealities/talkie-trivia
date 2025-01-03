import { useState, useEffect } from "react"
import { Movie, BasicMovie } from "../../models/movie"
import { useAppContext } from "../../contexts/appContext"

// Import your JSON data files
import popularMoviesData from "../../../data/popularMovies.json" // Assuming correct path
import basicMoviesData from "../../../data/basicMovies.json" // Assuming correct path

const useMovieData = () => {
  console.log("useMovieData: Hook function called") // Added log
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

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("useMovieData: Loading movie data...")
        setLoading(true)
        setError(null)

        // Use the imported data directly
        const loadedMovies: Movie[] = popularMoviesData
        console.log("useMovieData: Loaded movies:", loadedMovies.length)

        const loadedBasicMovies: BasicMovie[] = basicMoviesData
        console.log(
          "useMovieData: Loaded basic movies:",
          loadedBasicMovies.length
        )

        dispatch({ type: "SET_MOVIES", payload: loadedMovies })
        dispatch({ type: "SET_BASIC_MOVIES", payload: loadedBasicMovies })
      } catch (error: any) {
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
