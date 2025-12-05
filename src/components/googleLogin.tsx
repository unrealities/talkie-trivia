import React, { memo } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { useAuth } from "../contexts/authContext"
import { hapticsService } from "../utils/hapticsService"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Button } from "./ui/button"
import { Typography } from "./ui/typography"

const GoogleLogin: React.FC = memo(() => {
  const { player, user, handleSignIn, handleSignOut, isSigningIn, error } =
    useAuth()
  const styles = useStyles(themedStyles)

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
    <View style={styles.container}>
      <Button
        title={buttonText}
        onPress={handlePress}
        isLoading={isSigningIn}
        variant="secondary"
        style={styles.button}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{ disabled: isSigningIn }}
      />
      {error && (
        <Typography variant="error" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  )
})

interface GoogleLoginStyles {
  container: ViewStyle
  button: ViewStyle
  errorText: TextStyle
}

const themedStyles = (theme: Theme): GoogleLoginStyles => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: theme.responsive.scale(400),
    alignSelf: "center",
    paddingVertical: theme.spacing.small,
  },
  button: {
    width: "100%",
    maxWidth: theme.responsive.scale(280),
  },
  errorText: {
    marginTop: theme.spacing.small,
    textAlign: "center",
    fontSize: theme.responsive.responsiveFontSize(14),
  },
})

export default GoogleLogin
