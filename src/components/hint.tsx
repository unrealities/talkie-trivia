import React, { useState, memo, useCallback, useEffect, useRef } from "react"
import {
  View,
  Pressable,
  Text,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"
import { PlayerGame } from "../models/game"
import { hintStyles } from "../styles/hintStyles"
import { responsive } from "../styles/global"
import { colors } from "../styles/global"
import Icon from "react-native-vector-icons/FontAwesome"

interface HintProps {
  playerGame: PlayerGame
  updatePlayerGame: (updatedPlayerGame: PlayerGame) => void
  isInteractionsDisabled: boolean
  hintsAvailable: number
  updatePlayerStats: (updatedPlayerStats: any) => void
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const HintContainer = memo(
  ({
    playerGame,
    updatePlayerGame,
    isInteractionsDisabled,
    hintsAvailable,
    updatePlayerStats,
  }: HintProps) => {
    console.log("HintContainer Rendered - Hints Available:", hintsAvailable)
    const [hintUsed, setHintUsed] = useState<boolean>(false)
    const [isHintOptionsDisabled, setIsHintOptionsDisabled] =
      useState<boolean>(false)
    const [hintType, setHintType] = useState<
      "decade" | "director" | "actor" | "genre" | null
    >(null)
    const [showHintOptions, setShowHintOptions] = useState(false)
    const [displayedHintText, setDisplayedHintText] = useState<string | null>(
      null
    )
    const displayedHintTextRef = useRef(displayedHintText)

    useEffect(() => {
      setHintUsed(false)
      setHintType(null)
      setDisplayedHintText(null)
      setIsHintOptionsDisabled(false)
      setShowHintOptions(false)
    }, [playerGame.guesses.length])

    useEffect(() => {
      displayedHintTextRef.current = displayedHintText
      console.log("displayedHintText Updated:", displayedHintTextRef.current)
    }, [displayedHintText])

    const getHintText = useCallback(
      (hintType: "decade" | "director" | "actor" | "genre"): string => {
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
            text = "Error fetching hint"
        }
        console.log("Generated Hint Text:", text)
        return text
      },
      [playerGame]
    )

    const handleHintSelection = useCallback(
      (hint: "decade" | "director" | "actor" | "genre") => {
        if (
          isInteractionsDisabled ||
          hintUsed ||
          isHintOptionsDisabled ||
          hintsAvailable <= 0 ||
          !showHintOptions
        ) {
          console.log("Hint selection prevented - conditions not met")
          return
        }

        setHintType(hint)
        setHintUsed(true)
        const text = getHintText(hint)
        setDisplayedHintText(text)
        setIsHintOptionsDisabled(true)
        console.log(
          "Hint selected:",
          hint,
          "Hint Text:",
          text,
          "displayedHintText:",
          displayedHintTextRef.current
        )

        updatePlayerGame({
          ...playerGame,
          hintsUsed: {
            ...playerGame.hintsUsed,
            [playerGame.guesses.length]: hint,
          },
        })

        if (hintsAvailable > 0) {
          updatePlayerStats({
            hintsAvailable: hintsAvailable - 1,
          })
        }
        setShowHintOptions(false)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      },
      [
        isInteractionsDisabled,
        hintUsed,
        playerGame,
        isHintOptionsDisabled,
        updatePlayerGame,
        hintsAvailable,
        showHintOptions,
        updatePlayerStats,
        getHintText,
        displayedHintTextRef,
      ]
    )

    const handleToggleHintOptions = useCallback(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setShowHintOptions(!showHintOptions)
    }, [showHintOptions])

    const renderHintButtons = () => {
      const buttonTextStyle = hintStyles.buttonTextSmall

      const hintButton = (
        hintType: "decade" | "director" | "actor" | "genre",
        iconName: keyof typeof Icon.glyphMap,
        label: string
      ) => (
        <Pressable
          style={hintStyles.hintButton}
          onPress={() => handleHintSelection(hintType)}
          disabled={
            isInteractionsDisabled ||
            hintUsed ||
            isHintOptionsDisabled ||
            hintsAvailable <= 0 ||
            !showHintOptions
          }
          accessible
          accessibilityRole="button"
          accessibilityLabel={
            isInteractionsDisabled || hintsAvailable <= 0
              ? "Hint button disabled"
              : `Get the movie's ${label.toLowerCase()} hint. Hints available: ${hintsAvailable}`
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
          <View style={hintStyles.hintButtonArea}>
            {hintButton("decade", "calendar", "Decade")}
            {hintButton("director", "video-camera", "Director")}
            {hintButton("actor", "user", "Actor")}
            {hintButton("genre", "folder-open", "Genre")}
          </View>
        </View>
      )
    }

    let hintLabelText = ""
    if (hintsAvailable <= 0) {
      hintLabelText = "Out of hints!"
    } else if (hintUsed) {
      hintLabelText = `${hintsAvailable} Hints remaining. Please make a guess.`
    } else {
      hintLabelText = "Need a Hint?"
    }

    return (
      <View style={hintStyles.container}>
        <Pressable
          onPress={
            hintsAvailable > 0 && !isHintOptionsDisabled
              ? handleToggleHintOptions
              : undefined
          }
          disabled={hintsAvailable <= 0 || isHintOptionsDisabled}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={hintLabelText}
        >
          <Text style={hintStyles.hintLabel}>
            {hintLabelText}
            {hintsAvailable > 0 && !hintUsed && !showHintOptions
              ? ` (${hintsAvailable} available)`
              : ""}
          </Text>
        </Pressable>

        {hintsAvailable > 0 &&
          showHintOptions &&
          !isHintOptionsDisabled &&
          renderHintButtons()}

        {displayedHintText && (
          <Text style={hintStyles.hintText}>{displayedHintText}</Text>
        )}
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.playerGame === nextProps.playerGame &&
      prevProps.isInteractionsDisabled === nextProps.isInteractionsDisabled &&
      prevProps.hintsAvailable === nextProps.hintsAvailable &&
      prevProps.updatePlayerStats === nextProps.updatePlayerStats
    )
  }
)

export default HintContainer
