// src/components/personalizedStatsMessage.tsx

import React, { useState, useEffect, useMemo } from "react"
import { View, Text } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useAuth } from "../contexts/authContext"
import { gameService } from "../services/gameService"
import { GameHistoryEntry } from "../models/gameHistory"
import { getMovieStyles } from "../styles/movieStyles"
import { useTheme } from "../contexts/themeContext"
import { responsive } from "../styles/global"
import { useGameStore } from "../state/gameStore"

const PersonalizedStatsMessage: React.FC = () => {
  const { player } = useAuth()
  const playerStats = useGameStore((state) => state.playerStats)
  const playerGame = useGameStore((state) => state.playerGame)

  const [history, setHistory] = useState<GameHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])

  useEffect(() => {
    const fetchHistory = async () => {
      if (!player) return
      try {
        const fetchedHistory = await gameService.fetchGameHistory(player.id)
        setHistory(fetchedHistory)
      } catch (err) {
        console.error("Failed to fetch game history for stats message:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [player])

  const message = useMemo(() => {
    if (loading || !playerStats || !playerGame) return null

    if (playerGame.correctAnswer) {
      if (
        playerStats.currentStreak > 1 &&
        playerStats.currentStreak === playerStats.maxStreak
      ) {
        return {
          text: `New high streak: ${playerStats.currentStreak} wins in a row! 🔥`,
          icon: "rocket",
        }
      }
      if (playerStats.currentStreak >= 3) {
        return {
          text: `You're on a ${playerStats.currentStreak}-day winning streak!`,
          icon: "fire",
        }
      }
      if (playerGame.guesses.length === 1) {
        return {
          text: "A perfect score! Guessed on the first try!",
          icon: "star",
        }
      }
    }

    if (!playerGame.correctAnswer && playerStats.currentStreak > 3) {
      return {
        text: `You had an amazing ${playerStats.currentStreak}-day streak. New one starts tomorrow!`,
        icon: "calendar-check-o",
      }
    }

    if (history.length > 5) {
      const recentWins = history.slice(0, 7).filter((h) => h.wasCorrect).length
      const winRate = Math.round((recentWins / 7) * 100)
      return {
        text: `Your win rate over the last 7 days is ${winRate}%.`,
        icon: "line-chart",
      }
    }

    return { text: "Come back tomorrow for another movie!", icon: "film" }
  }, [playerStats, playerGame, history, loading])

  if (!message) return null

  return (
    <View style={movieStyles.personalizedMessageContainer}>
      <FontAwesome
        name={message.icon as any}
        size={responsive.scale(16)}
        color={colors.tertiary}
      />
      <Text style={movieStyles.personalizedMessageText}>{message.text}</Text>
    </View>
  )
}

export default PersonalizedStatsMessage
