import { StateCreator } from "zustand"
import { GameStoreState, SettingsSlice } from "../storeTypes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ASYNC_STORAGE_KEYS } from "../../config/constants"
import {
  DEFAULT_DIFFICULTY,
  DIFFICULTY_MODES,
  DIFFICULTY_RANKING,
} from "../../config/difficulty"
import { produce } from "immer"

export const createSettingsSlice: StateCreator<
  GameStoreState,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  gameMode: "movies",
  difficulty: DEFAULT_DIFFICULTY,

  setGameMode: async (mode) => {
    const { gameMode, playerGame, initializeGame, playerStats } = get()
    if (mode === gameMode) return

    // Prevent switching if game is active and not finished
    if (
      playerGame.guesses.length > 0 &&
      !playerGame.correctAnswer &&
      !playerGame.gaveUp
    ) {
      set({ flashMessage: "Finish the current game before switching modes!" })
      setTimeout(() => set({ flashMessage: null }), 3000)
      return
    }

    set({ gameMode: mode })

    // Re-initialize game with new mode
    // Note: We construct a minimal player object from existing stats to trigger reload
    const player = { id: playerGame.playerID, name: playerStats.id }
    await initializeGame(player)
  },

  setDifficulty: (newDifficulty) => {
    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.DIFFICULTY_SETTING, newDifficulty)

    set(
      produce((state: GameStoreState) => {
        state.difficulty = newDifficulty
        state.playerGame.guessesMax = DIFFICULTY_MODES[newDifficulty].guessesMax

        const currentLowestRank =
          DIFFICULTY_RANKING[state.playerGame.difficulty]
        const newRank = DIFFICULTY_RANKING[newDifficulty]

        // If they lower difficulty mid-game, update the record so score is calculated based on easier mode
        if (newRank < currentLowestRank) {
          state.playerGame.difficulty = newDifficulty
          state.flashMessage = `Score will be based on ${DIFFICULTY_MODES[newDifficulty].label} mode.`
        }
      })
    )
  },
})
