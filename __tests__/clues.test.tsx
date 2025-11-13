import React, { ReactElement } from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  RenderOptions,
} from "@testing-library/react-native";
import { ThemeProvider } from "../src/contexts/themeContext";
import CluesContainer from "../src/components/clues";
import { GameState, useGameStore } from "../src/state/gameStore";
import { hapticsService } from "../src/utils/hapticsService";
import { ScrollView } from "react-native";
import { defaultPlayerGame, defaultTriviaItem } from "../src/models/default";
import { PlayerGame } from "../src/models/game";
import { DEFAULT_DIFFICULTY } from "../src/config/difficulty";

jest.mock("../src/state/gameStore");
jest.mock("../src/utils/hapticsService");

const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
};

const mockSummary =
  "A young boy discovers a magical lamp. A powerful genie grants him three wishes, changing his life forever.";
const summaryChunks = [
  "A young boy discovers",
  "a magical lamp. A",
  "powerful genie grants him",
  "three wishes, changing his",
  "life forever.",
];
const fullSummaryText = summaryChunks.join(" ");

const defaultMockState: Partial<GameState> = {
  loading: false,
  isInteractionsDisabled: false,
  difficulty: DEFAULT_DIFFICULTY,
  playerGame: {
    ...defaultPlayerGame,
    triviaItem: {
      ...defaultTriviaItem,
      description: mockSummary,
    },
  },
};

type MockStateOverrides = Partial<Omit<GameState, "playerGame">> & {
  playerGame?: Partial<PlayerGame>;
};

describe("CluesContainer Component", () => {
  let scrollToEndSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    (useGameStore as unknown as jest.Mock).mockClear();
    (hapticsService.light as jest.Mock).mockClear();

    scrollToEndSpy = jest
      .spyOn(ScrollView.prototype, "scrollToEnd")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    scrollToEndSpy.mockRestore();
  });

  const setMockStoreState = (overrides: MockStateOverrides = {}) => {
    const newState = {
      ...defaultMockState,
      ...overrides,
      playerGame: {
        ...defaultMockState.playerGame!,
        ...(overrides.playerGame || {}),
      },
    };

    (useGameStore as unknown as jest.Mock).mockImplementation(
      (selector: (s: GameState) => any) => selector(newState as GameState)
    );
  };

  describe("Rendering States", () => {
    it("should render the skeleton component when loading", () => {
      setMockStoreState({ loading: true });
      renderWithTheme(<CluesContainer />);
      expect(screen.getByTestId("clues-skeleton")).toBeTruthy();
      expect(screen.queryByText(/words revealed/)).toBeNull();
    });

    it("should render the first clue chunk and correct word count on initial load", () => {
      setMockStoreState();
      renderWithTheme(<CluesContainer />);

      act(() => {
        jest.runAllTimers();
      });
      
      expect(screen.getByText(summaryChunks[0])).toBeTruthy();

      const revealedWords = summaryChunks[0].split(" ").length;
      const totalWords = mockSummary.trim().split(/\s+/).length;
      expect(
        screen.getByText(`${revealedWords}/${totalWords} words revealed`)
      ).toBeTruthy();
    });

    it("should render the full summary if the game is already over on load", () => {
      setMockStoreState({
        isInteractionsDisabled: true,
        playerGame: { guesses: [{ itemId: 123 }] },
      });
      renderWithTheme(<CluesContainer />);
      expect(screen.getByText(fullSummaryText)).toBeTruthy();
    });
  });

  describe("Game Progression", () => {
    it("should reveal the next clue chunk after a guess", () => {
      setMockStoreState({ playerGame: { guesses: [] } });
      const { rerender } = renderWithTheme(<CluesContainer />);

      act(() => jest.runAllTimers());
      expect(screen.getByText(summaryChunks[0])).toBeTruthy();

      (hapticsService.light as jest.Mock).mockClear();

      act(() => {
        setMockStoreState({ playerGame: { guesses: [{ itemId: 1 }] } });
        rerender(
          <ThemeProvider>
            <CluesContainer />
          </ThemeProvider>
        );
      });

      act(() => jest.runAllTimers());

      const expectedText = `${summaryChunks[0]} ${summaryChunks[1]}`;
      expect(screen.getByText(expectedText)).toBeTruthy();

      expect(hapticsService.light).toHaveBeenCalledTimes(1);
      expect(scrollToEndSpy).toHaveBeenCalledWith({ animated: true });
    });
  });

  describe("Interaction", () => {
    it("should call haptics on press", () => {
      setMockStoreState();
      renderWithTheme(<CluesContainer />);

      act(() => jest.runAllTimers());

      expect(screen.getByText(summaryChunks[0])).toBeTruthy();
      (hapticsService.light as jest.Mock).mockClear();

      const pressableArea = screen.getByLabelText(
        "Tap to reveal the full clue immediately"
      );
      fireEvent.press(pressableArea);

      expect(hapticsService.light).toHaveBeenCalledTimes(1);
    });

    it("should be non-interactive when the game is over", () => {
      setMockStoreState({ isInteractionsDisabled: true });
      renderWithTheme(<CluesContainer />);
      (hapticsService.light as jest.Mock).mockClear();

      expect(
        screen.queryByLabelText("Tap to reveal the full clue immediately")
      ).toBeNull();

      fireEvent.press(screen.getByText(fullSummaryText));
      expect(hapticsService.light).not.toHaveBeenCalled();
    });
  });
});
