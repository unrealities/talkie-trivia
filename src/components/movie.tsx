import React from "react"
import GameUI from "./gameUI"
import ErrorMessage from "./errorMessage"
import { useGameplay } from "../contexts/gameplayContext"

const MoviesContainer: React.FC = () => {
  const { isNetworkConnected } = useGameplay()

  if (!isNetworkConnected) {
    return (
      <ErrorMessage message="No Network Connection. Please check your internet and try again." />
    )
  }

  return <GameUI />
}

export default MoviesContainer
