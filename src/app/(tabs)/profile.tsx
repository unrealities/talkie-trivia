import React, { lazy, Suspense, useState, useCallback } from "react"
import { ScrollView, View, Text, ViewStyle, TextStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import LoadingIndicator from "../../components/loadingIndicator"
import { useAuth } from "../../contexts/authContext"
import { GameHistoryEntry } from "../../models/gameHistory"
import { useGameStore } from "../../state/gameStore"
import { FontAwesome } from "@expo/vector-icons"
import ProfileSection from "../../components/profileSection"
import { useStyles, Theme } from "../../utils/hooks/useStyles"
import { useTheme } from "../../contexts/themeContext"
import { u } from "../../styles/utils"

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

const ProfileScreen: React.FC = () => {
  const { player, user } = useAuth()
  const playerStats = useGameStore((state) => state.playerStats)
  const loading = useGameStore((state) => state.loading)
  const styles = useStyles(themedStyles)
  const { colors } = useTheme()

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

  if (!isUserAuthenticated || loading) {
    return (
      <LinearGradient
        colors={[colors.background, colors.backgroundLight]}
        style={u.flex}
      >
        <LoadingIndicator />
      </LinearGradient>
    )
  }

  return (
    <>
      <LinearGradient
        colors={[colors.background, colors.backgroundLight]}
        style={u.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Suspense fallback={<LoadingIndicator />}>
            <View style={styles.contentArea}>
              <View style={styles.header}>
                <Text style={styles.title}>Welcome, {displayName}!</Text>
              </View>

              {!isGoogleSignedIn && (
                <View style={styles.signInPromptContainer}>
                  <FontAwesome
                    name="google"
                    size={styles.signInPromptIcon.fontSize}
                    color={styles.signInPromptIcon.color}
                    style={u.mbMd}
                  />
                  <Text style={styles.signInPromptTitle}>
                    Save Your Progress
                  </Text>
                  <Text style={styles.signInPromptText}>
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
                <View style={styles.divider} />
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

interface ProfileScreenStyles {
  scrollContentContainer: ViewStyle
  contentArea: ViewStyle
  header: ViewStyle
  title: TextStyle
  divider: ViewStyle
  signInPromptContainer: ViewStyle
  signInPromptIcon: TextStyle
  signInPromptTitle: TextStyle
  signInPromptText: TextStyle
}

const themedStyles = (theme: Theme): ProfileScreenStyles => ({
  scrollContentContainer: {
    padding: theme.spacing.medium,
    paddingTop:
      theme.responsive.platform === "ios"
        ? theme.responsive.scale(60)
        : theme.responsive.scale(30),
    alignItems: "center",
    paddingBottom: theme.spacing.extraLarge,
  },
  contentArea: {
    width: "100%",
    maxWidth: theme.responsive.scale(500),
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.medium,
    paddingBottom: theme.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    width: "100%",
  },
  title: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.medium,
  },
  signInPromptContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.large,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.responsive.scale(12),
    width: "100%",
    maxWidth: theme.responsive.scale(500),
    marginBottom: theme.spacing.large,
  },
  signInPromptIcon: {
    fontSize: theme.responsive.scale(30),
    color: theme.colors.primary,
  },
  signInPromptTitle: {
    ...theme.typography.heading2,
    color: theme.colors.primary,
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    textAlign: "center",
  },
  signInPromptText: {
    ...theme.typography.bodyText,
    textAlign: "center",
    marginBottom: theme.spacing.small,
  },
})

export default ProfileScreen
