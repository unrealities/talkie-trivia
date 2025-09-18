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
      return movie.release_date ? `${movie.release_date.substring(0, 3)}0s` : ""
    case "director":
      return movie.director?.name || ""
    case "actor":
      return movie.actors?.[0]?.name || ""
    case "genre":
      return movie.genres?.[0]?.name || ""
    default:
      return ""
  }
}

/**
 * Compares a guessed movie with the correct movie to generate implicit hints.
 * It finds all new, unrevealed hints for the user.
 */
export function generateImplicitHint(
  guessedMovie: Movie,
  correctMovie: Movie,
  usedHints: Partial<Record<HintType, boolean>> = {}
): ImplicitHintResult {
  const result: ImplicitHintResult = {
    feedback: null,
    revealedHints: {},
    hintInfo: null,
  }

  const hintChecks: {
    type: HintType
    condition: boolean
    message: string
  }[] = [
    {
      type: "director",
      condition: guessedMovie.director?.id === correctMovie.director?.id,
      message: `You guessed another movie by the same director! (Hint Revealed)`,
    },
    {
      type: "actor",
      condition: !!correctMovie.actors
        .slice(0, 5)
        .find((actor) =>
          new Set(guessedMovie.actors.slice(0, 5).map((a) => a.id)).has(
            actor.id
          )
        ),
      message: `A lead actor from your guess is also in this movie! (Hint Revealed)`,
    },
    {
      type: "decade",
      condition:
        Math.floor(new Date(correctMovie.release_date).getFullYear() / 10) ===
        Math.floor(new Date(guessedMovie.release_date).getFullYear() / 10),
      message: `You're in the right decade! (Hint Revealed)`,
    },
    {
      type: "genre",
      condition: !!correctMovie.genres.find((genre) =>
        new Set(guessedMovie.genres.map((g) => g.id)).has(genre.id)
      ),
      message: `This movie shares a genre with your guess! (Hint Revealed)`,
    },
  ]

  // Find all new hints that match, not just the first one.
  const newHints: HintInfo[] = []

  for (const check of hintChecks) {
    if (check.condition && !usedHints[check.type]) {
      newHints.push({
        type: check.type,
        value: getHintValue(check.type, correctMovie),
      })
      result.revealedHints[check.type] = true
    }
  }

  if (newHints.length > 0) {
    // We provide feedback for the first new hint found to keep it simple.
    const firstNewHintType = newHints[0].type
    const feedbackMessage = hintChecks.find(
      (c) => c.type === firstNewHintType
    )?.message
    result.feedback = feedbackMessage || "Good guess! A hint was revealed."
    result.hintInfo = newHints
    return result
  }

  // If no new hints were found, check if we can give recurring feedback for an already-revealed hint.
  for (const check of hintChecks) {
    if (check.condition && usedHints[check.type]) {
      result.feedback = `You're on the right track with the ${check.type}!`
      // No new hint info to add here, just feedback text.
      return result
    }
  }

  return result
}
