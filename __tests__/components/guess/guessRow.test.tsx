import React, { ReactElement } from "react"
import { render, screen, RenderOptions } from "@testing-library/react-native"
import { ThemeProvider } from "../../../src/contexts/themeContext"
import { GuessRow } from "../../../src/components/guess/guessRow"
import { BasicTriviaItem } from "../../../src/models/trivia"
import { Guess } from "../../../src/models/game"

// Mock Animations
jest.mock("../../../src/utils/hooks/useGuessAnimation", () => ({
  useGuessAnimation: () => ({
    animatedTileStyle: {},
    animatedContentStyle: {},
    animatedFeedbackStyle: {},
  }),
}))

// Mock Reanimated
jest.mock("react-native-reanimated", () => {
  const { View, Text } = require("react-native")
  return {
    default: { View, Text },
    View: View,
    Text: Text,
  }
})

const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe("Guess Component: GuessRow", () => {
  const mockBasicItems: BasicTriviaItem[] = [
    // Use a mid-year date to avoid timezone rollovers (e.g. Jan 1st -> Dec 31st prev year)
    {
      id: 101,
      title: "Correct Movie",
      releaseDate: "2020-07-01",
      posterPath: "",
    },
    {
      id: 102,
      title: "Wrong Movie",
      releaseDate: "1999-05-05",
      posterPath: "",
    },
  ]

  const correctGuess: Guess = { itemId: 101, hintInfo: [] }
  const wrongGuess: Guess = {
    itemId: 102,
    hintInfo: [{ type: "director", label: "Director", value: "Nolan" }],
  }

  it("should render the movie title and year", () => {
    renderWithTheme(
      <GuessRow
        index={0}
        guess={correctGuess}
        basicItems={mockBasicItems}
        isLastGuess={false}
        lastGuessResult={null}
        correctItemId={101}
      />
    )

    expect(screen.getByText(/Correct Movie/)).toBeTruthy()
    // Should reliably match 2020 with a July date
    expect(screen.getByText(/2020/)).toBeTruthy()
  })

  it("should display hints found if implicit feedback is active", () => {
    renderWithTheme(
      <GuessRow
        index={1}
        guess={wrongGuess}
        basicItems={mockBasicItems}
        isLastGuess={false}
        lastGuessResult={null}
        correctItemId={101}
      />
    )

    expect(screen.getByText("Nolan")).toBeTruthy()
  })

  it("should display feedback overlay if it is the last guess and incorrect", () => {
    const feedbackMsg = "Getting Warmer!"
    const result = { itemId: 102, correct: false, feedback: feedbackMsg }

    renderWithTheme(
      <GuessRow
        index={1}
        guess={wrongGuess}
        basicItems={mockBasicItems}
        isLastGuess={true}
        lastGuessResult={result}
        correctItemId={101}
      />
    )

    expect(screen.getByText(feedbackMsg)).toBeTruthy()
  })
})
