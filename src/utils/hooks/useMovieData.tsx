import { useState, useEffect } from "react"
import { Movie, BasicMovie } from "../../models/movie"
import { useAppContext } from "../../contexts/AppContext"

const useMovieData = () => {
  const { state, dispatch } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const loadedMovies: Movie[] = require("../../../data/popularMovies.json")
        const loadedBasicMovies: BasicMovie[] = require("../../../data/basicMovies.json")

        // Dispatch actions to update the context state
        dispatch({ type: "SET_MOVIES", payload: loadedMovies })
        dispatch({ type: "SET_BASIC_MOVIES", payload: loadedBasicMovies })
      } catch (error) {
        console.error("loadData: Error caught:", error)
        setError("Error loading movie data.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dispatch, setLoading])

  return {
    movies: state.movies,
    basicMovies: state.basicMovies,
    loading,
    error,
  }
}

export default useMovieData
