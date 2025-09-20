import React, { lazy, Suspense, useState, useCallback, useMemo } from "react"
import { ScrollView, View, Text, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import LoadingIndicator from "../../components/loadingIndicator"
import { getAppStyles } from "../../styles/appStyles"
import { useAuth } from "../../contexts/authContext"
import { GameHistoryEntry } from "../../models/gameHistory"
import { useTheme } from "../../contexts/themeContext"
import { useGameStore } from "../../state/gameStore"

const GoogleLogin = lazy(() => import("../../components/googleLogin"))
const PlayerStatsContainer = lazy(() => import("../../components/playerStats"))
const GameHistory = lazy(() => import("../../components/gameHistory"))
const ThemeSelector = lazy(() => import("../../components/themeSelector"))
const DifficultySelector = lazy(
  () => import("../../components/difficultySelector")
)
const HistoryDetailModal = lazy(
  () => import("../../components/historyDetailModal")
)

const ProfileScreen: React.FC<{}> = () => {
  const { player } = useAuth()
  const playerStats = useGameStore((state) => state.playerStats)
  const loading = useGameStore((state) => state.loading)

  const { colors } = useTheme()
  const appStyles = useMemo(() => getAppStyles(colors), [colors])

  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<GameHistoryEntry | null>(null)

  const handleHistoryItemPress = useCallback((item: GameHistoryEntry) => {
    setSelectedHistoryItem(item)
  }, [])

  const handleModalClose = useCallback(() => {
    setSelectedHistoryItem(null)
  }, [])

  return (
    <>
      <LinearGradient
        colors={[colors.background, colors.backgroundLight]}
        style={appStyles.profileContainer}
      >
        <ScrollView
          contentContainerStyle={appStyles.profileContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Suspense fallback={<LoadingIndicator />}>
            <GoogleLogin />

            <View style={appStyles.profileCard}>
              <Text style={appStyles.profileCardTitle}>Settings</Text>
              <ThemeSelector />
              <DifficultySelector />
            </View>

            {loading && <LoadingIndicator />}
            {!loading && player && playerStats && (
              <View style={appStyles.profileCard}>
                <Text style={appStyles.profileCardTitle}>Your Stats</Text>
                <PlayerStatsContainer
                  player={player}
                  playerStats={playerStats}
                />
                <GameHistory onHistoryItemPress={handleHistoryItemPress} />
              </View>
            )}
          </Suspense>
        </ScrollView>
      </LinearGradient>
      <Suspense fallback={null}>
        <HistoryDetailModal
          historyItem={selectedHistoryItem}
          onClose={handleModalClose}
        />
      </Suspense>
    </>
  )
}

export default ProfileScreen
