import React, { useState, memo, useCallback, useEffect } from "react"
import { View, Pressable, Text, ViewStyle, StyleProp } from "react-native"
import { PlayerGame } from "../models/game"
import { hintStyles } from "../styles/hintStyles"
import { responsive } from "../styles/global"

interface HintProps {
  playerGame: PlayerGame
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  isInteractionsDisabled: boolean
}

const HintContainer = memo(
  ({ playerGame, updatePlayerGame, isInteractionsDisabled }: HintProps) => {
    const [hintUsed, setHintUsed] = useState<boolean>(false)
    const [hintType, setHintType] = useState<
      "decade" | "director" | "actor" | "genre" | null
    >(null)

    useEffect(() => {
      setHintUsed(false)
      setHintType(null)
    }, [playerGame.guesses.length])

    const handleHintSelection = useCallback(
      (hint: "decade" | "director" | "actor" | "genre") => {
        if (isInteractionsDisabled || hintUsed) {
          return
        }

        setHintType(hint)
        setHintUsed(true)
        updatePlayerGame({
          ...playerGame,
          hintsUsed: {
            ...playerGame.hintsUsed,
            [playerGame.guesses.length]: hint,
          },
        })
      },
      [isInteractionsDisabled, hintUsed, playerGame, updatePlayerGame]
    )

    const hintText = () => {
      if (hintType) {
        switch (hintType) {
          case "decade":
            return `📅 ${playerGame.game.movie.release_date.substring(0, 3)}0s`
          case "director":
            return `🎬 ${playerGame.game.movie.director.name}`
          case "actor":
            return `🎭 ${playerGame.game.movie.actors[0].name}`
          case "genre":
            return `🗂️ ${playerGame.game.movie.genres[0].name}`
          default:
            return null
        }
      }
      return null
    }

    const renderHintButtons = () => {
      if (hintUsed) {
        return null
      }
      const hintButtonStyle: StyleProp<ViewStyle> = {
        marginBottom: responsive.scale(5),
      }
      const buttonTextStyle = hintStyles.buttonTextSmall

      return (
        <View style={hintStyles.hintButtonsContainer}>
          <Text style={hintStyles.hintLabel}>Hint?</Text>
          <View style={hintStyles.hintButtonArea}>
            <Pressable
              style={({ pressed }) => [
                hintStyles.hintButton,
                isInteractionsDisabled && hintStyles.disabled,
                { opacity: pressed || isInteractionsDisabled ? 0.7 : 1 },
              ]}
              onPress={() => handleHintSelection("decade")}
              disabled={isInteractionsDisabled || hintUsed}
              accessible
              accessibilityRole="button"
              accessibilityLabel={
                isInteractionsDisabled
                  ? "Hint button disabled"
                  : "Get the movie's release decade"
              }
            >
              <Text style={hintStyles.buttonText}>📅</Text>
              <Text style={buttonTextStyle}>Decade</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                hintStyles.hintButton,
                isInteractionsDisabled && hintStyles.disabled,
                { opacity: pressed || isInteractionsDisabled ? 0.7 : 1 },
              ]}
              onPress={() => handleHintSelection("director")}
              disabled={isInteractionsDisabled || hintUsed}
              accessible
              accessibilityRole="button"
              accessibilityLabel={
                isInteractionsDisabled
                  ? "Hint button disabled"
                  : "Get the movie's director"
              }
            >
              <Text style={hintStyles.buttonText}>🎬</Text>
              {/* Removed conditional rendering to always display text */}
              <Text style={buttonTextStyle}>Director</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                hintStyles.hintButton,
                isInteractionsDisabled && hintStyles.disabled,
                { opacity: pressed || isInteractionsDisabled ? 0.7 : 1 },
              ]}
              onPress={() => handleHintSelection("actor")}
              disabled={isInteractionsDisabled || hintUsed}
              accessible
              accessibilityRole="button"
              accessibilityLabel={
                isInteractionsDisabled
                  ? "Hint button disabled"
                  : "Get the movie's first billed actor"
              }
            >
              <Text style={hintStyles.buttonText}>🎭</Text>
              <Text style={buttonTextStyle}>Actor</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                hintStyles.hintButton,
                isInteractionsDisabled && hintStyles.disabled,
                { opacity: pressed || isInteractionsDisabled ? 0.7 : 1 },
              ]}
              onPress={() => handleHintSelection("genre")}
              disabled={isInteractionsDisabled || hintUsed}
              // {...hintButtonProps("genre")} Removed this
              accessible
              accessibilityRole="button"
              accessibilityLabel={
                isInteractionsDisabled
                  ? "Hint button disabled"
                  : "Get the movie's first listed genre"
              }
            >
              <Text style={hintStyles.buttonText}>🗂️</Text>
              {/* Removed conditional rendering to always display text */}
              <Text style={buttonTextStyle}>Genre</Text>
            </Pressable>
          </View>
        </View>
      )
    }

    return (
      <View style={hintStyles.container}>
        {renderHintButtons()}
        <Text style={hintStyles.hintText}>{hintText()}</Text>
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.playerGame === nextProps.playerGame &&
      prevProps.isInteractionsDisabled === nextProps.isInteractionsDisabled
    )
  }
)

export default HintContainer
