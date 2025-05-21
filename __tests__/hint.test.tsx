import "react-native"

jest.mock("react-native-vector-icons/FontAwesome", () => "Icon")

import { View, Pressable, Text } from "react-native"

const MockHintUI = ({
  handleHintSelection,
  hintLabelText,
  isToggleDisabled,
  areHintButtonsDisabled,
}: any) => (
  <View>
    <Text>{hintLabelText}</Text>
    <Pressable
      onPress={() => {
        if (
          !isToggleDisabled &&
          !areHintButtonsDisabled &&
          handleHintSelection
        ) {
          handleHintSelection("hint1", 1)
        }
      }}
    >
      <Text>Hint Button</Text>
    </Pressable>
  </View>
)

jest.mock("../src/components/hintUI", () => ({
  __esModule: true,
  default: (props: any) => <MockHintUI {...props} />,
}))

import React from "react"
import {
  render,
  screen,
  fireEvent,
  within,
} from "@testing-library/react-native"
import HintContainer from "../src/components/hint"
import { useHintLogic } from "../src/utils/hooks/useHintLogic"
import { PlayerGame } from "../src/models/game"

jest.mock("../src/utils/hooks/useHintLogic")

const mockUseHintLogic = useHintLogic as jest.MockedFunction<
  typeof useHintLogic
>

describe("HintContainer", () => {
  const mockPlayerGame: PlayerGame = {
    gameId: "1",
    playerId: "player1",
    currentRound: 1,
    hintUsed: false,
    movieId: "movie1",
    guesses: [],
    hintsUsed: [],
    lastHintUsed: null,
  }

  const mockUpdatePlayerGame = jest.fn()
  const mockUpdatePlayerStats = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseHintLogic.mockReturnValue({
      showHintOptions: false,
      displayedHintText: "",
      hintLabelText: "",
      isToggleDisabled: false,
      areHintButtonsDisabled: false,
      handleToggleHintOptions: jest.fn(),
      handleHintSelection: jest.fn(),
    })
  })

  it("renders without crashing", () => {
    render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={false}
        hintsAvailable={3}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )
  })

  it("passes correct props to HintUI", () => {
    const mockHintLogicValues = {
      showHintOptions: true,

      displayedHintText: "Hint Text",
      hintLabelText: "Hint Label",
      isToggleDisabled: true,
      areHintButtonsDisabled: true,
      handleToggleHintOptions: jest.fn(),
      handleHintSelection: jest.fn(),
    }

    mockUseHintLogic.mockReturnValue(mockHintLogicValues)
    render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={false}
        hintsAvailable={3}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )

    expect(screen.getByText("Hint Label")).toBeTruthy()
  })

  it("calls handleHintSelection when a hint is selected", () => {
    const mockHandleHintSelection = jest.fn()
    mockUseHintLogic.mockReturnValue({
      showHintOptions: true,
      displayedHintText: "",
      hintLabelText: "",
      isToggleDisabled: false,
      areHintButtonsDisabled: false,
      handleToggleHintOptions: jest.fn(),
      handleHintSelection: mockHandleHintSelection,
    })

    render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={false}
        hintsAvailable={3}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )

    fireEvent.press(screen.getByText("Hint Button"))
    expect(mockHandleHintSelection).toHaveBeenCalledWith("hint1", 1)
  })

  it("does not call handleHintSelection if isInteractionsDisabled is true", () => {
    const mockHandleHintSelection = jest.fn()
    mockUseHintLogic.mockReturnValue({
      showHintOptions: true,
      displayedHintText: "Disabled Hint Text",
      hintLabelText: "Disabled Hint Label",
      isToggleDisabled: true,
      areHintButtonsDisabled: true,
      handleToggleHintOptions: jest.fn(),
      handleHintSelection: mockHandleHintSelection,
    })

    render(
      <HintContainer
        playerGame={mockPlayerGame}
        updatePlayerGame={mockUpdatePlayerGame}
        isInteractionsDisabled={true}
        hintsAvailable={3}
        updatePlayerStats={mockUpdatePlayerStats}
      />
    )

    fireEvent.press(screen.getByText("Hint Button"))
    expect(mockHandleHintSelection).not.toHaveBeenCalled()
  })
})
