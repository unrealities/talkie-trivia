import React, { lazy, useState, useCallback, Suspense, useMemo } from "react"
import { View, ScrollView } from "react-native"
import LoadingIndicator from "../../components/loadingIndicator"
import ErrorMessage from "../../components/errorMessage"
import { getAppStyles } from "../../styles/appStyles"
import { useAuth } from "../../contexts/authContext"
import { useGame } from "../../contexts/gameContext"
import { GameHistoryEntry } from "../../models/gameHistory"
import { useTheme } from "../../contexts/themeContext"

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
  const { playerStats, loading, error } = useGame()
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
      <ScrollView style={appStyles.container}>
        <Suspense fallback={<LoadingIndicator />}>
          <GoogleLogin />
          <ThemeSelector />
          <DifficultySelector />
          {loading && <LoadingIndicator />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && player && playerStats && (
            <>
              <PlayerStatsContainer player={player} playerStats={playerStats} />
              <GameHistory onHistoryItemPress={handleHistoryItemPress} />
            </>
          )}
        </Suspense>
      </ScrollView>

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
