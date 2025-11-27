import { useState, useCallback, useMemo, useEffect } from "react"
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
  signOut,
  User,
} from "firebase/auth"
import * as Google from "expo-auth-session/providers/google"
import Constants from "expo-constants"
import { analyticsService } from "../analyticsService"

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
          const result = await signInWithCredential(auth, credential)
          setAuthError(null)
          analyticsService.trackGoogleSignInSuccess(result.user.uid)
        } catch (e: any) {
          setAuthError(`Firebase sign-in error: ${e.message}`)
          analyticsService.trackGoogleSignInFailure(e.message)
        }
      } else if (response?.type === "error") {
        const errorMessage = `Google sign-in error: ${response.error?.message}`
        setAuthError(errorMessage)
        analyticsService.trackGoogleSignInFailure(errorMessage)
      }
      setIsLoading(false)
    }

    if (response) {
      handleGoogleResponse()
    }
  }, [response])

  const handleSignIn = useCallback(async () => {
    // CHECK BOTH SOURCES FOR E2E FLAG
    // 1. Constants (from app.config.js)
    // 2. Direct process.env (standard Expo behavior)
    const isE2E =
      Constants.expoConfig?.extra?.isE2E === true ||
      process.env.EXPO_PUBLIC_IS_E2E === "true"

    console.log("[Auth] Sign In attempted. E2E Mode Detected:", isE2E)

    if (isE2E) {
      console.log("[Auth] SKIPPING GOOGLE PROMPT. Using Mock.")
      onAuthStateChange({
        uid: "e2e-test-user",
        displayName: "E2E User",
        email: "e2e@example.com",
        isAnonymous: false,
        emailVerified: true,
        phoneNumber: null,
        photoURL: null,
        providerId: "google.com",
        metadata: {},
        providerData: [],
        refreshToken: "mock-token",
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => "mock-token",
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
      } as unknown as User)
      return
    }

    setIsLoading(true)
    setAuthError(null)
    analyticsService.trackGoogleSignInStart()
    try {
      await promptAsync()
    } catch (e: any) {
      console.error("Google prompt error:", e)
      setIsLoading(false)
    }
  }, [promptAsync, onAuthStateChange])

  const handleSignOut = useCallback(async () => {
    setIsLoading(true)
    setAuthError(null)
    try {
      analyticsService.trackSignOut()
      await signOut(getAuth())
    } catch (e: any) {
      setAuthError(`Sign-out error: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, authError, handleSignIn, handleSignOut }
}
