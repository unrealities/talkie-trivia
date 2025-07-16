import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react"
import { Movie, BasicMovie } from "../models/movie"
import popularMoviesData from "../../data/popularMovies.json"
import basicMoviesData from "../../data/basicMovies.json"

interface AssetsState {
  movies: readonly Movie[]
  basicMovies: readonly BasicMovie[]
  movieForToday: Movie | null
  loading: boolean
  error: string | null
}

const AssetsContext = createContext<AssetsState | undefined>(undefined)

export const AssetsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [movies, setMovies] = useState<readonly Movie[]>([])
  const [basicMovies, setBasicMovies] = useState<readonly BasicMovie[]>([])

  useEffect(() => {
    try {
      if (__DEV__) {
        console.log("AssetsContext: Loading static movie data...")
      }
      if (!popularMoviesData || popularMoviesData.length === 0) {
        throw new Error("Invalid or empty popular movies data.")
      }
      if (!basicMoviesData || basicMoviesData.length === 0) {
        throw new Error("Invalid or empty basic movies data.")
      }

      setMovies(popularMoviesData as Movie[])
      setBasicMovies(basicMoviesData as BasicMovie[])
      if (__DEV__) {
        console.log("AssetsContext: Static movie data loaded successfully.")
      }
    } catch (e: any) {
      console.error("AssetsContext: Error loading movie data:", e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const movieForToday = useMemo(() => {
    if (movies.length === 0) return null
    const today = new Date()
    const todayMovieIndex = today.getDate() % movies.length
    const movie = movies[todayMovieIndex]

    if (!movie || !movie.id || !movie.overview) {
      console.error("AssetsContext: Invalid movie for today selected.")
      setError("Could not determine a valid movie for today.")
      return null
    }
    return movie
  }, [movies])

  const value = { movies, basicMovies, movieForToday, loading, error }

  return (
    <AssetsContext.Provider value={value}>{children}</AssetsContext.Provider>
  )
}

export const useAssets = () => {
  const context = useContext(AssetsContext)
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetsProvider")
  }
  return context
}
