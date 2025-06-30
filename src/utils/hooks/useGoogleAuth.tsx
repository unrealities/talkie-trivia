import { useState, useCallback, useMemo, useEffect } from "react"
import { Alert } from "react-native"
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
  signOut,
  User,
  AuthError,
} from "firebase/auth"
import * as Google from "expo-auth-session/providers/google"
import Constants from "expo-constants"

export function useGoogleAuth(onAuthStateChange: (user: User | null) => void) {
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const authConfig = useMemo(
    () => ({
      androidClientId: Constants.expoConfig?.extra?.androidClientId,
      expoClientId: Constants.expoConfig?.extra?.expoClientId,
      iosClientId: Constants.expoConfig?.extra?.iosClientId,
      webClientId: Constants.expoConfig?.extra?.webClientId,
    }),
    []
  )

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    authConfig,
    {}
  )

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const { id_token } = response.params
        const auth = getAuth()
        const credential = GoogleAuthProvider.credential(id_token)
        try {
          await signInWithCredential(auth, credential)
          setAuthError(null)
        } catch (e: any) {
          setAuthError(`Firebase sign-in error: ${e.message}`)
        }
      } else if (response?.type === "error") {
        setAuthError(`Google sign-in error: ${response.error?.message}`)
      }
      setIsLoading(false)
    }

    if (response) {
      handleGoogleResponse()
    }
  }, [response])

  const handleSignIn = useCallback(async () => {
    setIsLoading(true)
    setAuthError(null)
    await promptAsync()
  }, [promptAsync])

  const handleSignOut = useCallback(async () => {
    setIsLoading(true)
    setAuthError(null)
    try {
      await signOut(getAuth())
    } catch (e: any) {
      setAuthError(`Sign-out error: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, authError, handleSignIn, handleSignOut }
}
