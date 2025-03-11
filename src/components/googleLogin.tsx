import React, { useCallback, useMemo, useState, memo } from "react"
import { Pressable, Text, View, ActivityIndicator, Alert } from "react-native"
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
  signOut,
  AuthError,
} from "firebase/auth"
import * as Google from "expo-auth-session/providers/google"
import Constants from "expo-constants"
import Player from "../models/player"
import { googleLoginStyles } from "../styles/googleLoginStyles"

interface GoogleLoginProps {
  player: Player
  onAuthStateChange?: (player: Player | null) => void
}

const GoogleLogin: React.FC<GoogleLoginProps> = memo(
  ({ player, onAuthStateChange }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)

    const authConfig = useMemo(() => {
      const config: Record<string, string | string[]> = {
        androidClientId: Constants?.expoConfig?.extra?.androidClientId,
        expoClientId: Constants?.expoConfig?.extra?.expoClientId,
        iosClientId: Constants?.expoConfig?.extra?.iosClientId,
        webClientId: Constants?.expoConfig?.extra?.webClientId,
        scopes: [
          "profile",
          "email",
          "openid",
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ],
      }

      return config
    }, [])

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
      authConfig || {}
    )

    // Centralized error handling
    const handleAuthError = useCallback((error: AuthError) => {
      if (!error) {
        return
      }
      setIsLoading(false)
      const errorMessage =
        error.code === "auth/network-request-failed"
          ? "Network error. Check your connection."
          : "Authentication failed. Please try again."

      setAuthError(errorMessage)
      Alert.alert("Authentication Error", errorMessage)
      console.error("Sign in error:", error)
    }, [])

    // Authenticated sign-in handler
    const handleSignIn = useCallback(async () => {
      if (!authConfig) {
        Alert.alert("Configuration Error", "Authentication not configured")
        return
      }

      setIsLoading(true)
      setAuthError(null)

      try {
        const result = await promptAsync()

        if (result.type === "success") {
          const { id_token } = result.params
          const auth = getAuth()
          const credential = GoogleAuthProvider.credential(id_token)

          await signInWithCredential(auth, credential)
          onAuthStateChange?.(player)
        }
      } catch (error) {
        handleAuthError(error as AuthError)
      } finally {
        setIsLoading(false)
      }
    }, [authConfig, handleAuthError, onAuthStateChange, player, promptAsync])

    // Sign-out handler
    const handleSignOut = useCallback(async () => {
      setIsLoading(true)
      try {
        const auth = getAuth()
        await signOut(auth)
        onAuthStateChange?.(null)
      } catch (error) {
        Alert.alert("Sign Out Error", "Failed to sign out. Please try again.")
        console.error("Sign out error:", error)
      } finally {
        setIsLoading(false)
      }
    }, [onAuthStateChange])

    return (
      <View style={googleLoginStyles.container}>
        <Pressable
          onPress={player.name ? handleSignOut : handleSignIn}
          style={({ pressed }) => [
            googleLoginStyles.button,
            { opacity: pressed || isLoading ? 0.7 : 1 },
          ]}
          disabled={isLoading}
          accessibilityLabel={
            player.name ? `Sign out ${player.name}` : "Sign in with Google"
          }
          accessibilityHint={
            player.name
              ? "Signs you out of the game"
              : "Signs you in with your Google account"
          }
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={googleLoginStyles.buttonText}>
              {player.name ? `Sign Out ${player.name}` : "Sign In with Google"}
            </Text>
          )}
        </Pressable>
        {authError && (
          <Text style={googleLoginStyles.errorText}>{authError}</Text>
        )}
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.player === nextProps.player &&
      prevProps.onAuthStateChange === nextProps.onAuthStateChange
    )
  }
)

export default GoogleLogin
