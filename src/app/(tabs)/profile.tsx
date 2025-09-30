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

const Section: React.FC<{
  title: string
  icon: keyof typeof FontAwesome.glyphMap
  children: React.ReactNode
}> = ({ title, icon, children }) => {
  const { colors } = useTheme()
  const appStyles = useMemo(() => getAppStyles(colors), [colors])
  return (
    <View style={appStyles.profileSection}>
      <View style={appStyles.profileSectionHeader}>
        <FontAwesome
          name={icon}
          size={responsive.responsiveFontSize(16)}
          color={colors.primary}
        />
        <Text style={appStyles.profileSectionTitle}>{title}</Text>
      </View>
      <View style={appStyles.profileSectionContent}>{children}</View>
    </View>
  )
}

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

  const headerSubtitle = isGoogleSignedIn
    ? "Here's how you're doing."
    : "You are currently playing as a guest. Your game data is saved locally but is not backed up or shared on leaderboards."

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
              <View style={{ width: "100%" }}>
                <View style={appStyles.profileHeader}>
                  <Text style={appStyles.profileTitle}>
                    Welcome, {displayName}!
                  </Text>
                  <Text style={appStyles.profileSubtitle}>
                    {headerSubtitle}
                  </Text>
                </View>

                <Section title="Statistics" icon="bar-chart">
                  <PlayerStatsContainer
                    player={player}
                    playerStats={playerStats}
                  />
                </Section>

                <Section title="Game History" icon="history">
                  <GameHistory onHistoryItemPress={handleHistoryItemPress} />
                </Section>

                <Section title="Settings" icon="cog">
                  <ThemeSelector />
                  <View style={appStyles.divider} />
                  <DifficultySelector />
                </Section>

                {!isGoogleSignedIn && (
                  <View
                    style={[
                      appStyles.signInPromptContainer,
                      {
                        marginTop: 0,
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
                  <Section title="Account" icon="user">
                    <GoogleLogin />
                  </Section>
                )}
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
