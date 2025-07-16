import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react"
import {
  getAuth,
  onAuthStateChanged,
  User,
  signInAnonymously,
} from "firebase/auth"
import { getFirestore, doc } from "firebase/firestore"
import { fetchOrCreatePlayer } from "../utils/firestore/playerDataServices"
import Player from "../models/player"
import { useGoogleAuth } from "../utils/hooks/useGoogleAuth"

interface AuthState {
  player: Player | null
  user: User | null
  loading: boolean
  error: string | null
  handleSignIn: () => Promise<void>
  handleSignOut: () => Promise<void>
  isSigningIn: boolean
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const onAuthStateChange = useCallback((newUser: User | null) => {
    setUser(newUser)
  }, [])

  const {
    isLoading: isSigningIn,
    authError: googleAuthError,
    handleSignIn,
    handleSignOut,
  } = useGoogleAuth(onAuthStateChange)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setLoading(true)
        setError(null)

        try {
          if (firebaseUser) {
            if (__DEV__) {
              console.log("AuthContext: User is signed in:", firebaseUser.uid)
            }
            setUser(firebaseUser)
            const db = getFirestore()
            const fetchedPlayer = await fetchOrCreatePlayer(
              db,
              firebaseUser.uid,
              firebaseUser.displayName || "Guest"
            )
            setPlayer(fetchedPlayer)
          } else {
            if (__DEV__) {
              console.log(
                "AuthContext: No user signed in, attempting anonymous sign-in."
              )
            }
            await signInAnonymously(auth)
            // The onAuthStateChanged listener will re-trigger with the new anonymous user
          }
        } catch (e: any) {
          console.error(
            "AuthContext: Error during auth state change handling:",
            e
          )
          setError(`Authentication failed: ${e.message}`)
          setPlayer(null)
          setUser(null)
        } finally {
          setLoading(false)
        }
      },
      (e) => {
        console.error("AuthContext: onAuthStateChanged error:", e)
        setError(`Auth state listener error: ${e.message}`)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const value = {
    player,
    user,
    loading,
    error: error || googleAuthError,
    handleSignIn,
    handleSignOut,
    isSigningIn,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
