import React, { lazy, Suspense, useState, useCallback, useMemo } from "react"
import { ScrollView, View, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import LoadingIndicator from "../../components/loadingIndicator"
import { getAppStyles } from "../../styles/appStyles"
import { useAuth } from "../../contexts/authContext"
import { GameHistoryEntry } from "../../models/gameHistory"
import { useTheme } from "../../contexts/themeContext"
import { useGameStore } from "../../state/gameStore"
import { FontAwesome } from "@expo/vector-icons"
import { responsive } from "../../styles/global"
import ProfileSection from "../../components/profileSection"

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
  const { player, user } = useAuth()
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

  const isGoogleSignedIn = player && user && !user.isAnonymous
  const isUserAuthenticated = player && user

  const displayName = player?.name || "Guest"

  if (!isUserAuthenticated) {
    return (
      <LinearGradient
        colors={[colors.background, colors.backgroundLight]}
        style={appStyles.profileContainer}
      >
        <LoadingIndicator />
      </LinearGradient>
    )
  }

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
            {loading ? (
              <LoadingIndicator />
            ) : (
              <View style={appStyles.profileContentArea}>
                <View style={appStyles.profileHeader}>
                  <Text style={appStyles.profileTitle}>
                    Welcome, {displayName}!
                  </Text>
                </View>

                {!isGoogleSignedIn && (
                  <View
                    style={[
                      appStyles.signInPromptContainer,
                      {
                        marginTop: 0,
                        marginBottom: 20,
                        paddingVertical: responsive.scale(15),
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      },
                    ]}
                  >
                    <FontAwesome
                      name="google"
                      size={responsive.scale(30)}
                      color={colors.primary}
                      style={{ marginBottom: responsive.scale(10) }}
                    />
                    <Text style={appStyles.signInPromptTitle}>
                      Save Your Progress
                    </Text>
                    <Text style={appStyles.signInPromptText}>
                      Sign in with Google below to secure your stats permanently
                      and join the leaderboards.
                    </Text>
                    <GoogleLogin />
                  </View>
                )}

                {isGoogleSignedIn && (
                  <ProfileSection title="Account" icon="user">
                    <GoogleLogin />
                  </ProfileSection>
                )}

                <ProfileSection title="Settings" icon="cog">
                  <DifficultySelector />
                  <View style={appStyles.divider} />
                  <ThemeSelector />
                </ProfileSection>

                <ProfileSection title="Statistics" icon="bar-chart">
                  <PlayerStatsContainer
                    player={player}
                    playerStats={playerStats}
                  />
                </ProfileSection>

                <ProfileSection title="Game History" icon="history">
                  <GameHistory onHistoryItemPress={handleHistoryItemPress} />
                </ProfileSection>
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
