import { Movie } from "../models/movie"
import { HintInfo, HintType } from "../models/game"

interface ImplicitHintResult {
  feedback: string | null
  revealedHints: Partial<Record<HintType, boolean>>
  hintInfo: HintInfo[] | null
}

const getHintValue = (type: HintType, movie: Movie): string => {
  switch (type) {
    case "decade":
      // Handle movies without a proper date gracefully
      if (!movie.release_date || movie.release_date.length < 4) return ""
      return `${movie.release_date.substring(0, 3)}0s`
    case "director":
      return movie.director?.name || ""
    case "actor":
      // For actor hints in the guess list, we use the first actor's name
      return movie.actors?.[0]?.name || ""
    case "genre":
      return movie.genres?.[0]?.name || ""
    default:
      return ""
  }
}

/**
 * Compares a guessed movie with the correct movie to generate implicit hints.
 * It finds all matching attributes for display and marks new matches as revealed.
 */
export function generateImplicitHint(
  guessedMovie: Movie,
  correctMovie: Movie,
  usedHints: Partial<Record<HintType, boolean>> = {}
): ImplicitHintResult {
  const result: ImplicitHintResult = {
    feedback: null,
    revealedHints: {},
    hintInfo: [],
  }

  const hintsFound: HintInfo[] = []
  let newHintRevealed = false
  let firstNewMatchMessage: string | null = null

  // Ensure movies have basic properties for comparison
  if (!guessedMovie || !correctMovie) {
    return {
      feedback: "An unexpected error occurred with movie data.",
      revealedHints: {},
      hintInfo: null,
    }
  }

  const hintChecks: {
    type: HintType
    condition: boolean
    message: string
  }[] = [
    {
      type: "decade",
      condition:
        !!guessedMovie.release_date &&
        !!correctMovie.release_date &&
        Math.floor(new Date(correctMovie.release_date).getFullYear() / 10) ===
          Math.floor(new Date(guessedMovie.release_date).getFullYear() / 10),
      message: `You're in the right decade! (Hint Revealed)`,
    },
    {
      type: "director",
      condition:
        guessedMovie.director?.id === correctMovie.director?.id &&
        !!correctMovie.director?.id,
      message: `You guessed another movie by the same director! (Hint Revealed)`,
    },
    {
      type: "actor",
      condition:
        !!correctMovie.actors &&
        !!guessedMovie.actors &&
        // Check if top 5 actors of correct movie are present in top 5 of guessed movie
        correctMovie.actors
          .slice(0, 5)
          .some((actor) =>
            new Set(guessedMovie.actors.slice(0, 5).map((a) => a.id)).has(
              actor.id
            )
          ),
      message: `A lead actor from your guess is also in this movie! (Hint Revealed)`,
    },
    {
      type: "genre",
      condition:
        !!correctMovie.genres &&
        !!guessedMovie.genres &&
        // Check if any genre overlaps
        correctMovie.genres.some((genre) =>
          new Set(guessedMovie.genres.map((g) => g.id)).has(genre.id)
        ),
      message: `This movie shares a genre with your guess! (Hint Revealed)`,
    },
  ]

  // 1. Check for all matches and track new revelations
  for (const check of hintChecks) {
    if (check.condition) {
      const value = getHintValue(check.type, correctMovie)
      if (value) {
        hintsFound.push({ type: check.type, value })

        if (!usedHints[check.type]) {
          result.revealedHints[check.type] = true
          newHintRevealed = true
          if (!firstNewMatchMessage) {
            // Use the exciting message for the *first* newly revealed hint
            firstNewMatchMessage = check.message
          }
        }
      }
    }
  }

  // 2. Format the final result
  result.hintInfo = hintsFound

  // 3. Set the feedback message based on the outcome
  if (newHintRevealed) {
    result.feedback = firstNewMatchMessage
  } else if (hintsFound.length > 0) {
    // If nothing new was revealed, but something matched (already-known hints)
    result.feedback = "You're getting warmer! Try another movie."
  } else {
    result.feedback = "Not quite! Try again."
  }

  return result
}
