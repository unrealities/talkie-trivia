import React, { useState, useEffect, memo, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native"
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore"
import { Image } from "expo-image"

import { useAuth } from "../contexts/authContext"
import { GameHistoryEntry } from "../models/gameHistory"
import { gameHistoryEntryConverter } from "../utils/firestore/converters/gameHistoryEntry"
import { gameHistoryStyles as styles } from "../styles/gameHistoryStyles"
import { colors } from "../styles/global"

interface GameHistoryItemProps {
  item: GameHistoryEntry
  onPress: (item: GameHistoryEntry) => void
}

const GameHistoryItem = memo(({ item, onPress }: GameHistoryItemProps) => {
  const posterUri = `https://image.tmdb.org/t/p/w185${item.posterPath}`
  const date = new Date(item.dateId)
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const getResultText = () => {
    if (item.wasCorrect) {
      return (
        <Text style={[styles.resultText, styles.winText]}>
          Correct in {item.guessCount}/{item.guessesMax} guesses!
        </Text>
      )
    }
    if (item.gaveUp) {
      return <Text style={[styles.resultText, styles.lossText]}>Gave up</Text>
    }
    return <Text style={[styles.resultText, styles.lossText]}>Incorrect</Text>
  }

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.itemContainer,
        pressed && { backgroundColor: colors.grey },
      ]}
    >
      <Image source={{ uri: posterUri }} style={styles.posterImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.movieTitle}
        </Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
        {getResultText()}
      </View>
    </Pressable>
  )
})

interface GameHistoryProps {
  onHistoryItemPress: (item: GameHistoryEntry) => void
}

const GameHistory = ({ onHistoryItemPress }: GameHistoryProps) => {
  const { player } = useAuth()
  const [history, setHistory] = useState<GameHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!player) return

      try {
        const db = getFirestore()
        const historyRef = collection(
          db,
          `players/${player.id}/gameHistory`
        ).withConverter(gameHistoryEntryConverter)

        const q = query(historyRef, orderBy("dateId", "desc"), limit(20))

        const querySnapshot = await getDocs(q)
        const fetchedHistory = querySnapshot.docs.map((doc) => doc.data())

        setHistory(fetchedHistory)
      } catch (err: any) {
        console.error("Failed to fetch game history:", err)
        setError("Could not load game history.")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [player])

  const renderItem = useCallback(
    ({ item }: { item: GameHistoryEntry }) => (
      <GameHistoryItem item={item} onPress={onHistoryItemPress} />
    ),
    [onHistoryItemPress]
  )

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game History</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.dateId}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Play a game to see your history here!
            </Text>
          </View>
        )}
      />
    </View>
  )
}

export default GameHistory
