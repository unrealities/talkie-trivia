import { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  User,
  signInAnonymously,
} from "firebase/auth"
import { firebaseConfig } from "../../config/firebase"

let app: any

try {
  app = initializeApp(firebaseConfig)
  console.log("useAuthentication: Firebase app initialized successfully")
} catch (error) {
  console.error("useAuthentication: Error initializing Firebase app:", error)
}

const auth = app ? getAuth(app) : null

const isFirebaseAuthError = (error: any): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    typeof error.code === "string" &&
    error.code.startsWith("auth/")
  )
}

export function useAuthentication() {
  console.log("useAuthentication: Hook called")
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) {
      console.error(
        "useAuthentication: Firebase auth is not initialized (app init failed)."
      )
      setAuthError("Firebase app initialization failed.")
      setAuthLoading(false)
      return
    }

    let isMounted = true
    setAuthLoading(true)

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!isMounted) return

        if (firebaseUser) {
          console.log(
            "useAuthentication: User is signed in:",
            firebaseUser.uid,
            "Anonymous:",
            firebaseUser.isAnonymous
          )
          setUser(firebaseUser)
          setAuthError(null)
          setAuthLoading(false)
        } else {
          console.log(
            "useAuthentication: No user signed in. Attempting anonymous sign-in."
          )
          try {
            const userCredential = await signInAnonymously(auth)
            console.log(
              "useAuthentication: Anonymous sign-in successful, user from credential:",
              userCredential.user.uid
            )
          } catch (anonError: any) {
            console.error(
              "useAuthentication: Error signing in anonymously:",
              anonError
            )
            let errorMessage = "Failed to sign in anonymously."
            if (isFirebaseAuthError(anonError)) {
              errorMessage = `Anonymous sign-in failed: ${anonError.message} (Code: ${anonError.code})`
            } else if (anonError?.message) {
              errorMessage = `Anonymous sign-in failed: ${anonError.message}`
            }
            setAuthError(errorMessage)
            setUser(null)
            setAuthLoading(false)
          }
        }
      },
      (error: any) => {
        if (!isMounted) return
        console.error(
          "useAuthentication: Firebase Auth Error (onAuthStateChanged):",
          error
        )
        let errorMessage = `Auth state error.`
        if (isFirebaseAuthError(error)) {
          errorMessage = `Auth state error: ${error.message} (Code: ${error.code})`
        } else if (error?.message) {
          errorMessage = `Auth state error: ${error.message}`
        }
        setAuthError(errorMessage)
        setUser(null)
        setAuthLoading(false)
      }
    )

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  console.log("useAuthentication: Returning:", { user, authLoading, authError })
  return {
    user,
    authLoading,
    authError,
  }
}
