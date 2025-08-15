import { useState, useEffect, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Difficulty } from "../../models/game"
import { ASYNC_STORAGE_KEYS } from "../../config/constants"
import { analyticsService } from "../analyticsService"

const ONBOARDING_STORAGE_KEY = ASYNC_STORAGE_KEYS.ONBOARDING_STATUS
const DIFFICULTY_STORAGE_KEY = ASYNC_STORAGE_KEYS.DIFFICULTY_SETTING

export function useGameSettings() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [difficulty, setDifficultyState] = useState<Difficulty>("medium")

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [storedDifficulty, hasSeenOnboarding] = await Promise.all([
          AsyncStorage.getItem(
            DIFFICULTY_STORAGE_KEY
          ) as Promise<Difficulty | null>,
          AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
        ])

        if (storedDifficulty) {
          setDifficultyState(storedDifficulty)
        }
        if (hasSeenOnboarding === null) {
          analyticsService.trackOnboardingStarted()
          setShowOnboarding(true)
        }
      } catch (e) {
        console.error("Failed to load settings from storage", e)
      }
    }
    loadSettings()
  }, [])

  const setDifficulty = useCallback(async (newDifficulty: Difficulty) => {
    try {
      await AsyncStorage.setItem(DIFFICULTY_STORAGE_KEY, newDifficulty)
      setDifficultyState(newDifficulty)
    } catch (e) {
      console.error("Failed to save difficulty setting", e)
    }
  }, [])

  const handleDismissOnboarding = useCallback(async () => {
    try {
      analyticsService.trackOnboardingCompleted()
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true")
      setShowOnboarding(false)
    } catch (e) {
      console.error("Failed to save onboarding status to storage", e)
      setShowOnboarding(false)
    }
  }, [])

  return {
    difficulty,
    setDifficulty,
    showOnboarding,
    handleDismissOnboarding,
  }
}
