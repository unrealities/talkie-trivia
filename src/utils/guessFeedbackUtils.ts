import { Movie } from "../models/movie"
import { PlayerGame, HintType } from "../models/game"

interface ImplicitHintResult {
  feedback: string | null
  revealedHints: Partial<Record<HintType, boolean>>
}

/**
 * Compares a guessed movie with the correct movie to generate implicit hints.
 * It prioritizes the most impactful hint to display to the user, but returns all revealed hint types.
 */
export function generateImplicitHint(
  guessedMovie: Movie,
  correctMovie: Movie
): ImplicitHintResult {
  const result: ImplicitHintResult = {
    feedback: null,
    revealedHints: {},
  }

  // 1. Check for Same Director
  if (guessedMovie.director?.id === correctMovie.director?.id) {
    const feedback = `You guessed another movie by the same director! (Hint Revealed)`
    if (!result.feedback) result.feedback = feedback
    result.revealedHints.director = true
  }

  // 2. Check for Shared Actor (top 5 for relevance)
  const guessedActorIds = new Set(
    guessedMovie.actors.slice(0, 5).map((a) => a.id)
  )
  const commonActor = correctMovie.actors
    .slice(0, 5)
    .find((actor) => guessedActorIds.has(actor.id))

  if (commonActor) {
    const feedback = `${commonActor.name} is also in this movie! (Hint Revealed)`
    if (!result.feedback) result.feedback = feedback
    result.revealedHints.actor = true
  }

  // 3. Check for Same Decade
  const correctYear = new Date(correctMovie.release_date).getFullYear()
  const guessedYear = new Date(guessedMovie.release_date).getFullYear()
  if (Math.floor(correctYear / 10) === Math.floor(guessedYear / 10)) {
    const feedback = `You're in the right decade! (Hint Revealed)`
    if (!result.feedback) result.feedback = feedback
    result.revealedHints.decade = true
  }

  // 4. Check for Shared Genre
  const guessedGenreIds = new Set(guessedMovie.genres.map((g) => g.id))
  const commonGenre = correctMovie.genres.find((genre) =>
    guessedGenreIds.has(genre.id)
  )
  if (commonGenre) {
    const feedback = `This movie shares the genre: ${commonGenre.name}. (Hint Revealed)`
    if (!result.feedback) result.feedback = feedback
    result.revealedHints.genre = true
  }

  return result
}
