import React, { useState, memo, useCallback, useEffect } from "react"
import { View, Pressable, Text } from "react-native"
import { PlayerGame } from "../models/game"
import { hintStyles } from "../styles/hintStyles"
import { responsive } from "../styles/global"
import { colors } from "../styles/global"
import Icon from "react-native-vector-icons/FontAwesome" // Import Icon

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
    console.log("HintContainer Rendered")
    const [hintUsed, setHintUsed] = useState<boolean>(false)
    const [hintType, setHintType] = useState<
      "decade" | "director" | "actor" | "genre" | null
    >(null)
    const [localHintsAvailable, setLocalHintsAvailable] =
      useState(hintsAvailable)

    useEffect(() => {
      setHintUsed(false)
      setHintType(null)
      setLocalHintsAvailable(hintsAvailable)
    }, [playerGame.guesses.length, hintsAvailable])

    const handleHintSelection = useCallback(
      (hint: "decade" | "director" | "actor" | "genre") => {
        if (isInteractionsDisabled || hintUsed || localHintsAvailable <= 0) {
          return
        }

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
            text = `${playerGame.game.movie.release_date.substring(0, 3)}0s`
            break
          case "director":
            text = `${playerGame.game.movie.director.name}`
            break
          case "actor":
            text = `${playerGame.game.movie.actors[0].name}`
            break
          case "genre":
            text = `${playerGame.game.movie.genres[0].name}`
            break
          default:
            return null
        }
        return text
      }
      return null
    }

    const renderHintButtons = () => {
      if (hintUsed) {
        return null
      }

      const buttonTextStyle = hintStyles.buttonTextSmall

      const hintButton = (
        hintType: "decade" | "director" | "actor" | "genre",
        iconName: keyof typeof Icon.glyphMap,
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
          <Icon
            name={iconName}
            size={responsive.scale(20)}
            color={colors.secondary}
          />
          <Text style={buttonTextStyle}>{label}</Text>
        </Pressable>
      )

      return (
        <View style={hintStyles.hintButtonsContainer}>
          <Text style={hintStyles.hintLabel}>
            Need a Hint? ({localHintsAvailable} available)
          </Text>
          <View style={hintStyles.hintButtonArea}>
            {hintButton("decade", "calendar", "Decade")}
            {hintButton("director", "video-camera", "Director")}
            {hintButton("actor", "mask", "Actor")}
            {hintButton("genre", "folder-open", "Genre")}
          </View>
        </View>
      )
    }

    const displayedHintText = hintText()

    return (
      <View style={hintStyles.container}>
        {renderHintButtons()}
        {displayedHintText && (
          <Text style={hintStyles.hintText}>{displayedHintText}</Text>
        )}{" "}
        {/* Conditionally render hint text */}
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
