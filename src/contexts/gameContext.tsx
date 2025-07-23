import React, {
  createContext,
  useContext,
  ReactNode,
  StyleProp,
  ViewStyle,
} from "react"
import { useGameLogic } from "../utils/hooks/useGameLogic"
import { Movie, BasicMovie } from "../models/movie"
import { PlayerGame } from "../models/game"
import PlayerStats from "../models/playerStats"
import Player from "../models/player"
interface GameContextState {
  playerGame: PlayerGame
  playerStats: PlayerStats
  loading: boolean
  error: string | null
  movies: readonly Movie[]
  basicMovies: readonly BasicMovie[]
  showModal: boolean
  showConfetti: boolean
  isInteractionsDisabled: boolean
  animatedModalStyles: StyleProp<ViewStyle>
  showOnboarding: boolean
  handleConfettiStop: () => void
  setShowModal: (show: boolean) => void
  setShowConfetti: (show: boolean) => void
  handleDismissOnboarding: () => void
  updatePlayerGame: (game: PlayerGame) => void
  updatePlayerStats: (stats: PlayerStats) => void
  player: Player | null
}

const GameContext = createContext<GameContextState | undefined>(undefined)

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const gameLogicState = useGameLogic()

  return (
    <GameContext.Provider value={gameLogicState}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
