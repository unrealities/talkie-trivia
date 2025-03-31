import { useState, useCallback, useMemo, useEffect } from "react"
import { Alert } from "react-native"
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  User,
  AuthError,
} from "firebase/auth"
import * as Google from "expo-auth-session/providers/google"
import Constants from "expo-constants"
import Player from "../../models/player"

interface UseGoogleAuthReturn {
  isLoading: boolean
  authError: string | null
  handleSignIn: () => Promise<void>
  handleSignOut: () => Promise<void>
  currentUser: User | null
}

export function useGoogleAuth(
  onAuthStateChange?: (player: Player | null) => void
): UseGoogleAuthReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(
    getAuth().currentUser
  )

  const authConfig = useMemo(() => {
    const clientIdKeys = [
      "androidClientId",
      "expoClientId",
      "iosClientId",
      "webClientId",
    ]
    const hasAllKeys = clientIdKeys.every(
      (key) => Constants?.expoConfig?.extra?.[key]
    )

    if (!hasAllKeys) {
      console.warn(
        "useGoogleAuth: Google Sign-In is not fully configured. Check environment variables/app.config.js"
      )
      return null
    }

    return {
      androidClientId: Constants.expoConfig.extra.androidClientId,
      expoClientId: Constants.expoConfig.extra.expoClientId,
      iosClientId: Constants.expoConfig.extra.iosClientId,
      webClientId: Constants.expoConfig.extra.webClientId,
      scopes: ["profile", "email", "openid"],
    }
  }, [])

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    authConfig ?? {},
    {}
  )

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("useGoogleAuth: onAuthStateChanged triggered, user:", user)
      setCurrentUser(user)

      if (onAuthStateChange) {
        if (user) {
          const playerFromUser = new Player(
            user.uid,
            user.displayName || "Guest"
          )
          onAuthStateChange(playerFromUser)
        } else {
          onAuthStateChange(null)
        }
      }
    })

    return () => unsubscribe()
  }, [onAuthStateChange])

  const handleAuthProcessError = useCallback(
    (process: "Sign-In" | "Sign-Out", error: any) => {
      setIsLoading(false)
      let errorMessage = `Google ${process} Error. Please try again.`
      let logMessage = `Google ${process} Error:`

      if (error instanceof AuthError) {
        logMessage = `Firebase ${process} Error:`
        if (error.code === "auth/network-request-failed") {
          errorMessage = "Network error. Check your connection and try again."
        } else if (
          error.code === "auth/cancelled-popup-request" ||
          error.code === "auth/popup-closed-by-user"
        ) {
          errorMessage = `${process} cancelled.`
          logMessage = `${process} cancelled by user.`
          console.log(logMessage)
          setAuthError(null)
          return
        }
      } else if (error?.message?.includes("ERR_NETWORK")) {
        errorMessage = "Network error. Check your connection and try again."
      } else if (
        error?.type === "cancel" ||
        error?.message?.includes("cancelled")
      ) {
        errorMessage = `${process} cancelled.`
        logMessage = `${process} cancelled by user (Expo Auth Session).`
        console.log(logMessage)
        setAuthError(null)
        return
      }

      setAuthError(errorMessage)
      Alert.alert(`Google ${process} Error`, errorMessage)
      console.error(logMessage, error)
    },
    []
  )

  const handleSignIn = useCallback(async () => {
    if (!authConfig || !promptAsync) {
      Alert.alert("Configuration Error", "Google Sign-In is not available.")
      return
    }
    if (isLoading) return

    setIsLoading(true)
    setAuthError(null)

    try {
      console.log("useGoogleAuth: Prompting for Google Sign-In...")
      const result = await promptAsync()
      console.log("useGoogleAuth: Google Sign-In prompt result:", result?.type)

      if (result?.type === "success") {
        const { id_token } = result.params
        if (!id_token) {
          throw new Error("ID token missing from Google response.")
        }
        const auth = getAuth()
        const credential = GoogleAuthProvider.credential(id_token)
        console.log("useGoogleAuth: Signing in with Firebase credential...")
        await signInWithCredential(auth, credential)
        console.log("useGoogleAuth: Firebase sign-in successful.")

        setAuthError(null)
      } else if (result?.type === "cancel") {
        handleAuthProcessError("Sign-In", result)
      } else if (result?.type === "error") {
        throw (
          result.error ||
          new Error(
            result.params?.error_description || "Unknown Google Sign-In error"
          )
        )
      }
    } catch (error) {
      handleAuthProcessError("Sign-In", error)
    } finally {
      setIsLoading(false)
    }
  }, [authConfig, promptAsync, isLoading, handleAuthProcessError])

  const handleSignOut = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    setAuthError(null)
    try {
      console.log("useGoogleAuth: Signing out from Firebase...")
      const auth = getAuth()
      await signOut(auth)
      console.log("useGoogleAuth: Firebase sign-out successful.")
    } catch (error) {
      handleAuthProcessError("Sign-Out", error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, handleAuthProcessError])

  return {
    isLoading,
    authError,
    handleSignIn,
    handleSignOut,
    currentUser,
  }
}
