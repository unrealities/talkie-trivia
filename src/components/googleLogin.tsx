import React, { memo, useMemo } from "react"
import { Pressable, Text, View, ActivityIndicator } from "react-native"
import { getGoogleLoginStyles } from "../styles/googleLoginStyles"
import { useAuth } from "../contexts/authContext"
import ErrorMessage from "./errorMessage"
import { hapticsService } from "../utils/hapticsService"
import { useTheme } from "../contexts/themeContext"

const GoogleLogin: React.FC = memo(() => {
  const { player, user, handleSignIn, handleSignOut, isSigningIn, error } =
    useAuth()
  const { colors } = useTheme()
  const googleLoginStyles = useMemo(
    () => getGoogleLoginStyles(colors),
    [colors]
  )

  const isSignedIn = !!user && !user.isAnonymous
  const displayName = user?.displayName || player?.name || ""

  const buttonText = isSignedIn
    ? `Sign Out ${displayName}`.trim()
    : "Sign In with Google"
  const accessibilityLabel = isSignedIn
    ? `Sign out ${displayName}`.trim()
    : "Sign in with Google"
  const accessibilityHint = isSignedIn
    ? "Signs you out of the game"
    : "Signs you in with your Google account"

  const handlePress = () => {
    hapticsService.medium()
    if (isSignedIn) {
      handleSignOut()
    } else {
      handleSignIn()
    }
  }

  return (
    <View style={googleLoginStyles.container}>
      <Pressable
        testID="googleButton"
        onPress={handlePress}
        style={({ pressed }) => [
          googleLoginStyles.button,
          { opacity: pressed || isSigningIn ? 0.7 : 1 },
        ]}
        disabled={isSigningIn}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{ disabled: isSigningIn }}
      >
        {isSigningIn ? (
          <ActivityIndicator
            size="small"
            color={googleLoginStyles.buttonText.color}
            testID="activityIndicator"
          />
        ) : (
          <Text style={googleLoginStyles.buttonText}>{buttonText}</Text>
        )}
      </Pressable>
      {error && <ErrorMessage message={error} />}
    </View>
  )
})

export default GoogleLogin
