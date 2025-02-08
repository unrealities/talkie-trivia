import React, { useState, memo, useCallback, useEffect } from "react"
import { View, Pressable, Text, ViewStyle, StyleProp } from "react-native"
import { PlayerGame } from "../models/game"
import { hintStyles } from "../styles/hintStyles"
import { responsive } from "../styles/global"

interface HintProps {
  playerGame: PlayerGame
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  isInteractionsDisabled: boolean
  hintsAvailable: number
}

const HintContainer = memo(
  ({
    playerGame,
    updatePlayerGame,
    isInteractionsDisabled,
    hintsAvailable,
  }: HintProps) => {
    console.log("HintContainer Rendered") // ADDED: Log when component renders
    const [hintUsed, setHintUsed] = useState<boolean>(false)
    const [hintType, setHintType] = useState<
      "decade" | "director" | "actor" | "genre" | null
    >(null)
    const [localHintsAvailable, setLocalHintsAvailable] =
      useState(hintsAvailable)

    useEffect(() => {
      console.log(
        "HintContainer useEffect: guesses.length changed",
        playerGame.guesses.length,
        "hintsAvailable prop:",
        hintsAvailable
      ) // ADDED: Log effect trigger
      setHintUsed(false)
      setHintType(null)
      setLocalHintsAvailable(hintsAvailable)
    }, [playerGame.guesses.length, hintsAvailable])

    const handleHintSelection = useCallback(
      (hint: "decade" | "director" | "actor" | "genre") => {
        if (isInteractionsDisabled || hintUsed || localHintsAvailable <= 0) {
          return
        }

        console.log("Hint Selected:", hint) // ADDED: Log hint selection
        setHintType(hint)
        setHintUsed(true)
        setLocalHintsAvailable((prevHints) => prevHints - 1)

        updatePlayerGame({
          ...playerGame,
          hintsUsed: {
            ...playerGame.hintsUsed,
            [playerGame.guesses.length]: hint,
          },
        })
      },
      [
        isInteractionsDisabled,
        hintUsed,
        playerGame,
        updatePlayerGame,
        localHintsAvailable,
      ]
    )

    const hintText = () => {
      if (hintType) {
        let text = ""
        switch (hintType) {
          case "decade":
            text = `📅 ${playerGame.game.movie.release_date.substring(0, 3)}0s`
            break
          case "director":
            text = `🎬 ${playerGame.game.movie.director.name}`
            break
          case "actor":
            text = `🎭 ${playerGame.game.movie.actors[0].name}`
            break
          case "genre":
            text = `🗂️ ${playerGame.game.movie.genres[0].name}`
            break
          default:
            return null // No hint type, return null
        }
        console.log("Hint Text Displayed:", text, "hintType:", hintType) // ADDED: Log hint text and type
        return text
      }
      console.log("No Hint Text (hintType is null or no hint selected)") // ADDED: Log when no hint text
      return null
    }

    const renderHintButtons = () => {
      console.log("renderHintButtons called, hintUsed:", hintUsed) // ADDED: Log button render
      if (hintUsed) {
        return null
      }

      const buttonTextStyle = hintStyles.buttonTextSmall

      const hintButton = (
        hintType: "decade" | "director" | "actor" | "genre",
        icon: string,
        label: string
      ) => (
        <Pressable
          style={({ pressed }) => [
            hintStyles.hintButton,
            localHintsAvailable <= 0 && hintStyles.disabled,
            { opacity: pressed || localHintsAvailable <= 0 ? 0.7 : 1 },
            hintUsed && hintStyles.usedHintButton,
          ]}
          onPress={() => handleHintSelection(hintType)}
          disabled={
            isInteractionsDisabled || hintUsed || localHintsAvailable <= 0
          }
          accessible
          accessibilityRole="button"
          accessibilityLabel={
            isInteractionsDisabled || localHintsAvailable <= 0
              ? "Hint button disabled"
              : `Get the movie's ${label.toLowerCase()} hint. Hints available: ${localHintsAvailable}`
          }
        >
          <Text style={hintStyles.buttonText}>{icon}</Text>
          <Text style={buttonTextStyle}>{label}</Text>
        </Pressable>
      )

      return (
        <View style={hintStyles.hintButtonsContainer}>
          <Text style={hintStyles.hintLabel}>
            Need a Hint? ({localHintsAvailable} available)
          </Text>
          <View style={hintStyles.hintButtonArea}>
            {hintButton("decade", "📅", "Decade")}
            {hintButton("director", "🎬", "Director")}
            {hintButton("actor", "🎭", "Actor")}
            {hintButton("genre", "🗂️", "Genre")}
          </View>
        </View>
      )
    }

    const displayedHintText = hintText() // Store hintText result to avoid recalculation in render

    return (
      <View style={hintStyles.container}>
        {renderHintButtons()}
        <Text style={hintStyles.hintText}>{displayedHintText}</Text>
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.playerGame === nextProps.playerGame &&
      prevProps.isInteractionsDisabled === nextProps.isInteractionsDisabled &&
      prevProps.hintsAvailable === nextProps.hintsAvailable
    )
  }
)

export default HintContainer
