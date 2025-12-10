import { create } from "zustand"
import { createGameSlice } from "./slices/gameSlice"
import { createUISlice } from "./slices/uiSlice"
import { createSettingsSlice } from "./slices/settingsSlice"
import { createDataSlice } from "./slices/dataSlice"
import { GameStoreState } from "./storeTypes"

export * from "./storeTypes"
export type GameState = GameStoreState

export const useGameStore = create<GameStoreState>((...a) => ({
  ...createGameSlice(...a),
  ...createUISlice(...a),
  ...createSettingsSlice(...a),
  ...createDataSlice(...a),
}))
