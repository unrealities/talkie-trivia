import { StateCreator } from "zustand"
import { GameStoreState, DataSlice } from "../storeTypes"

export const createDataSlice: StateCreator<
  GameStoreState,
  [],
  [],
  DataSlice
> = (set) => ({
  basicItems: [],
  fullItems: [],

  setGameData: (fullItems, basicItems) => set({ fullItems, basicItems }),
})
