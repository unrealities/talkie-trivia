import { StateCreator } from "zustand"
import { GameStoreState, UISlice } from "../storeTypes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ASYNC_STORAGE_KEYS } from "../../config/constants"
import { analyticsService } from "../../utils/analyticsService"
import { produce } from "immer"

export const createUISlice: StateCreator<GameStoreState, [], [], UISlice> = (
  set
) => ({
  loading: true,
  error: null,
  showModal: false,
  showConfetti: false,
  flashMessage: null,
  tutorialState: {
    showGuessInputTip: false,
    showResultsTip: false,
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setShowModal: (show) => set({ showModal: show }),
  setFlashMessage: (message) => set({ flashMessage: message }),

  handleConfettiStop: () => set({ showConfetti: false }),

  dismissGuessInputTip: () => {
    set(
      produce((state) => {
        state.tutorialState.showGuessInputTip = false
      })
    )
    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TUTORIAL_GUESS_INPUT_SEEN, "true")
  },

  dismissResultsTip: () => {
    set(
      produce((state) => {
        state.tutorialState.showResultsTip = false
      })
    )
    analyticsService.trackOnboardingCompleted()
    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TUTORIAL_RESULTS_SEEN, "true")
  },
})
