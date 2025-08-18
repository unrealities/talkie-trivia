import React, { createContext, useContext, ReactNode } from "react"
import { Difficulty } from "../models/game"
import { useGameSettings } from "../utils/hooks/useGameSettings"

interface GameSettingsState {
  difficulty: Difficulty
  setDifficulty: (difficulty: Difficulty) => void
  showOnboarding: boolean
  handleDismissOnboarding: () => void
}

const GameSettingsContext = createContext<GameSettingsState | undefined>(
  undefined
)

export const GameSettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const settings = useGameSettings()

  return (
    <GameSettingsContext.Provider value={settings}>
      {children}
    </GameSettingsContext.Provider>
  )
}

export const useGameSettingsContext = () => {
  const context = useContext(GameSettingsContext)
  if (context === undefined) {
    throw new Error(
      "useGameSettingsContext must be used within a GameSettingsProvider"
    )
  }
  return context
}
