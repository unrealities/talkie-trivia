import React, { memo } from "react"
import { Pressable, Text, View, ActivityIndicator, Alert } from "react-native"
import Player from "../models/player"
import { googleLoginStyles } from "../styles/googleLoginStyles"
import { useGoogleAuth } from "../utils/hooks/useGoogleAuth"

interface GoogleLoginProps {
  player: Player | null
  onAuthStateChange?: (player: Player | null) => void
}

const GoogleLogin: React.FC<GoogleLoginProps> = memo(
  ({ player, onAuthStateChange }) => {
    const { isLoading, authError, handleSignIn, handleSignOut, currentUser } =
      useGoogleAuth(onAuthStateChange)

    const isSignedIn = !!currentUser

    const displayName = currentUser?.displayName || player?.name || ""

    const buttonText = isSignedIn
      ? `Sign Out ${displayName}`.trim()
      : "Sign In with Google"
    const accessibilityLabel = isSignedIn
      ? `Sign out ${displayName}`.trim()
      : "Sign in with Google"
    const accessibilityHint = isSignedIn
      ? "Signs you out of the game"
      : "Signs you in with your Google account"
    const onPressAction = isSignedIn ? handleSignOut : handleSignIn

    return (
      <View style={googleLoginStyles.container}>
        <Pressable
          testID="googleButton"
          onPress={onPressAction}
          style={({ pressed }) => [
            googleLoginStyles.button,
            { opacity: pressed || isLoading ? 0.7 : 1 },
          ]}
          disabled={isLoading}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole="button"
          accessibilityState={{ disabled: isLoading }}
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={googleLoginStyles.buttonText.color}
              testID="activityIndicator"
            />
          ) : (
            <Text style={googleLoginStyles.buttonText}>{buttonText}</Text>
          )}
        </Pressable>
        {authError && (
          <Text style={googleLoginStyles.errorText}>{authError}</Text>
        )}
      </View>
    )
  }
)

export default GoogleLogin
