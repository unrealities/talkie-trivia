import { useState, useEffect } from "react"
import { Movie, BasicMovie } from "../../models/movie"
import { useAppContext } from "../../contexts/appContext"

import popularMoviesData from "../../../data/popularMovies.json"
import basicMoviesData from "../../../data/basicMovies.json"

const useMovieData = () => {
  console.log("useMovieData: Hook function called")
  const { state, dispatch } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: "SET_IS_LOADING", payload: true })
      try {
        console.log("useMovieData: Loading movie data...")
        setLoading(true)
        setLoadError(null)

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
        setLoadError(`useMovieData: Error loading movie data: ${error.message}`)
        dispatch({
          type: "SET_DATA_LOADING_ERROR",
          payload: `useMovieData: Error loading movie data: ${error.message}`,
        })
      } finally {
        console.log("useMovieData: Finally block executed.")
        setLoading(false)
        dispatch({ type: "SET_IS_LOADING", payload: false })
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
    error: loadError,
  }
}

export default useMovieData
