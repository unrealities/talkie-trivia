import { Movie } from "../models/movie"
import { PlayerGame, HintType } from "../models/game"

interface ImplicitHintResult {
  feedback: string | null
  revealedHints: Partial<Record<HintType, boolean>>
  hintType: HintType | null
}

/**
 * Compares a guessed movie with the correct movie to generate implicit hints.
 * It prioritizes revealing a NEW, unrevealed hint to the user.
 */
export function generateImplicitHint(
  guessedMovie: Movie,
  correctMovie: Movie,
  usedHints: Partial<Record<HintType, boolean>> = {}
): ImplicitHintResult {
  const result: ImplicitHintResult = {
    feedback: null,
    revealedHints: {},
    hintType: null,
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

  // Find the first matching hint that has NOT already been revealed.
  for (const check of hintChecks) {
    if (check.condition && !usedHints[check.type]) {
      result.feedback = check.message
      result.revealedHints[check.type] = true
      result.hintType = check.type
      // Once we find a new hint to reveal, we stop.
      return result
    }
  }

  // If no new hints were found, check if we can give recurring feedback for an already-revealed hint.
  for (const check of hintChecks) {
    if (check.condition && usedHints[check.type]) {
      result.feedback = `You're on the right track with the ${check.type}!`
      // Don't set revealedHints here, as it's not new.
      return result
    }
  }

  return result
}
