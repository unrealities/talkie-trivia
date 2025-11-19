// __tests__/gameHistory.test.tsx

import React, { ReactElement } from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  RenderOptions,
} from "@testing-library/react-native";
import { ThemeProvider } from "../src/contexts/themeContext";
import GameHistory from "../src/components/gameHistory";
import { useAuth } from "../src/contexts/authContext";
import { gameService } from "../src/services/gameService";
import { hapticsService } from "../src/utils/hapticsService";
import { GameHistoryEntry } from "../src/models/gameHistory";

// --- Mocking Dependencies ---
jest.mock("@shopify/flash-list", () => {
  const React = require("react");
  const { FlatList } = require("react-native");
  return {
    FlashList: React.forwardRef((props: any, ref: any) => (
      <FlatList ref={ref} {...props} />
    )),
  };
});
jest.mock("../src/contexts/authContext");
jest.mock("../src/services/gameService");
jest.mock("../src/utils/hapticsService");

const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
};

const mockUseAuth = useAuth as jest.Mock;
const mockGameService = gameService as jest.Mocked<typeof gameService>;

const mockHistoryData: GameHistoryEntry[] = [
  { dateId: "2025-11-15", itemId: 101, itemTitle: "Inception", posterPath: "/inception.jpg", wasCorrect: true, gaveUp: false, guessCount: 2, guessesMax: 5, difficulty: "LEVEL_3", score: 850, gameMode: "movies" },
];

describe("GameHistory Component", () => {
  const onHistoryItemPressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ player: { id: "test-player-id" } });
  });

  afterEach(cleanup);

  describe("Loading State", () => {
    it("should display skeleton loaders while fetching data", () => {
      mockGameService.fetchGameHistory.mockReturnValue(new Promise(() => {}));
      
      renderWithTheme(<GameHistory onHistoryItemPress={onHistoryItemPressMock} />);

      // The refactored component now reliably renders these items
      const skeletons = screen.getAllByTestId("skeleton-item");
      expect(skeletons.length).toBe(5);
      expect(screen.queryByText("Inception")).toBeNull();
    });
  });

  describe("Data Display", () => {
    it("should render a list of game history items on successful fetch", async () => {
      mockGameService.fetchGameHistory.mockResolvedValue(mockHistoryData);
      
      renderWithTheme(<GameHistory onHistoryItemPress={onHistoryItemPressMock} />);

      expect(await screen.findByText("Inception")).toBeTruthy();
      expect(screen.getByText("Correct in 2/5 guesses!")).toBeTruthy();
      expect(screen.queryAllByTestId("skeleton-item").length).toBe(0);
    });
  });

  describe("Empty and Error States", () => {
    it("should display an empty message if no history is returned", async () => {
      mockGameService.fetchGameHistory.mockResolvedValue([]);
      renderWithTheme(<GameHistory onHistoryItemPress={onHistoryItemPressMock} />);
      expect(await screen.findByText("Play a game to see your history here!")).toBeTruthy();
    });

    it("should display an error message if the fetch fails", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      mockGameService.fetchGameHistory.mockRejectedValue(new Error("Network Error"));
      renderWithTheme(<GameHistory onHistoryItemPress={onHistoryItemPressMock} />);
      expect(await screen.findByText("Could not load game history.")).toBeTruthy();
      consoleErrorSpy.mockRestore();
    });

    it("should display the empty message if there is no authenticated player", async () => {
      mockUseAuth.mockReturnValue({ player: null });
      renderWithTheme(<GameHistory onHistoryItemPress={onHistoryItemPressMock} />);

      // The component logic was updated to immediately set loading to false.
      // We still use findByText to wait for the state update.
      const emptyMessage = await screen.findByText("Play a game to see your history here!");
      expect(emptyMessage).toBeTruthy();
      expect(gameService.fetchGameHistory).not.toHaveBeenCalled();
      expect(screen.queryAllByTestId("skeleton-item").length).toBe(0);
    });
  });

  describe("Interaction", () => {
    it("should call onHistoryItemPress with the correct item when pressed", async () => {
      mockGameService.fetchGameHistory.mockResolvedValue(mockHistoryData);
      renderWithTheme(<GameHistory onHistoryItemPress={onHistoryItemPressMock} />);

      const firstItem = await screen.findByText("Inception");
      fireEvent.press(firstItem);

      expect(onHistoryItemPressMock).toHaveBeenCalledWith(mockHistoryData[0]);
    });
  });
});