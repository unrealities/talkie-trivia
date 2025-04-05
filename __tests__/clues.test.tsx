import React from "react"
import { render, screen, waitFor, within } from "@testing-library/react-native"
import CluesContainer from "../src/components/clues"
import { PlayerGame } from "../src/models/game"
import { defaultPlayerGame } from "../src/models/default"
import { Movie } from "../src/models/movie"

const createMockPlayerGame = (
  overview: string,
  guesses: number[] = [],
  correctAnswer: boolean = false,
  gaveUp: boolean = false
): PlayerGame => ({
  ...defaultPlayerGame,
  guesses: guesses,
  correctAnswer: correctAnswer,
  gaveUp: gaveUp,
  game: {
    ...defaultPlayerGame.game,
    movie: {
      ...defaultPlayerGame.game.movie,
      id: 123,
      title: "Test Movie",
      overview: overview,
    } as Movie,
  },
  id: "player-game-1",
  playerID: "player-1",
})

const longSummary =
  "This is the first part of the summary. This is the second part, slightly longer. Third part continues the story revealing more plot points. Fourth part builds tension towards the climax. And finally, the fifth part concludes the narrative arc."

const longSummaryParts = [
  "This is the first part of the summary.",
  "This is the second part, slightly longer.",
  "Third part continues the story revealing more plot points.",
  "Fourth part builds tension towards the climax.",
  "And finally, the fifth part concludes the narrative arc.",
]
const totalWords = longSummary.split(" ").length

describe("CluesContainer Component", () => {
  it("renders skeleton when movie overview is initially empty", () => {
    const mockGame = createMockPlayerGame("")
    render(
      <CluesContainer
        correctGuess={false}
        guesses={[]}
        summary=""
        playerGame={mockGame}
        isGameOver={false}
      />
    )

    expect(screen.queryByText(/part of the summary/)).toBeNull()

    expect(screen.queryByText(/\//)).toBeNull()
  })

  it("renders the first clue initially (0 guesses)", async () => {
    const mockGame = createMockPlayerGame(longSummary)
    render(
      <CluesContainer
        correctGuess={false}
        guesses={[]}
        summary={longSummary}
        playerGame={mockGame}
        isGameOver={false}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(longSummaryParts[0])).toBeTruthy()
      expect(screen.queryByText(longSummaryParts[1])).toBeNull()

      const firstPartWords = longSummaryParts[0].split(" ").length
      expect(screen.getByText(`${firstPartWords}/${totalWords}`)).toBeTruthy()
    })
  })

  it("renders more clues after guesses are added", async () => {
    const mockGame = createMockPlayerGame(longSummary, [101])
    render(
      <CluesContainer
        correctGuess={false}
        guesses={[101]}
        summary={longSummary}
        playerGame={mockGame}
        isGameOver={false}
      />
    )

    await waitFor(() => {
      const combinedText = `${longSummaryParts[0]} ${longSummaryParts[1]}`
      expect(screen.getByText(combinedText)).toBeTruthy()
      expect(screen.queryByText(longSummaryParts[2])).toBeNull()

      const revealedWords = combinedText.split(" ").length
      expect(screen.getByText(`${revealedWords}/${totalWords}`)).toBeTruthy()
    })
  })

  it("renders all clues when correctGuess is true", async () => {
    const mockGame = createMockPlayerGame(longSummary, [101, 102], true)
    render(
      <CluesContainer
        correctGuess={true}
        guesses={[101, 102]}
        summary={longSummary}
        playerGame={mockGame}
        isGameOver={true}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(longSummary)).toBeTruthy()

      expect(screen.getByText(`${totalWords}/${totalWords}`)).toBeTruthy()
    })
  })

  it("renders all clues when isGameOver is true (even if not correct)", async () => {
    const mockGame = createMockPlayerGame(
      longSummary,
      [1, 2, 3, 4, 5],
      false,
      false
    )
    render(
      <CluesContainer
        correctGuess={false}
        guesses={[1, 2, 3, 4, 5]}
        summary={longSummary}
        playerGame={mockGame}
        isGameOver={true}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(longSummary)).toBeTruthy()

      expect(screen.getByText(`${totalWords}/${totalWords}`)).toBeTruthy()
    })
  })

  it("handles a summary shorter than the number of splits", async () => {
    const shortSummary = "A short summary."
    const mockGame = createMockPlayerGame(shortSummary)
    render(
      <CluesContainer
        correctGuess={false}
        guesses={[]}
        summary={shortSummary}
        playerGame={mockGame}
        isGameOver={false}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(shortSummary)).toBeTruthy()
      const shortTotalWords = shortSummary.split(" ").length
      expect(
        screen.getByText(`${shortTotalWords}/${shortTotalWords}`)
      ).toBeTruthy()
    })
  })
})
