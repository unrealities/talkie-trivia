import { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { firebaseConfig } from "../../config/firebase"

let app

try {
  app = initializeApp(firebaseConfig)
  console.log("useAuthentication: Firebase app initialized successfully")
} catch (error) {
  console.error("useAuthentication: Error initializing Firebase app:", error)
}

const auth = getAuth(app)

export function useAuthentication() {
  console.log("useAuthentication: Hook called")
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!app) {
      console.error("useAuthentication: firebase app not initialized")
      setAuthLoading(false)
      return
    }
    let isMounted = true

    const initialCheck = new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          if (isMounted) {
            setUser(user)
            console.log("onAuthStateChanged (initial check): User:", user)

            console.log(
              "useAuthentication: Setting authLoading to false from initial check"
            )
            setAuthLoading(false)
            resolve() // Resolve the promise
            unsubscribe() // Unsubscribe immediately
          }
        },
        (error) => {
          if (isMounted) {
            console.error(
              "useAuthentication: Firebase Auth Error (initial check):",
              error
            )
            setAuthError(
              `useAuthentication: Firebase Auth Error (initial check): ${error.message}`
            )
            setAuthLoading(false)
            resolve() // Resolve even with error to stop the loading
            unsubscribe() // Unsubscribe immediately
          }
        }
      )
    })

    initialCheck.then(() => {
      if (isMounted) {
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            if (isMounted) {
              setUser(user)
              console.log("onAuthStateChanged: User:", user)
              console.log(
                "useAuthentication: Setting authLoading to false after initial check"
              )
              setAuthLoading(false)
            }
          },
          (error) => {
            if (isMounted) {
              console.error(
                "useAuthentication: Firebase Auth Error (after initial check):",
                error
              )
              setAuthError(
                `useAuthentication: Firebase Auth Error (after initial check): ${error.message}`
              )
              setAuthLoading(false)
            }
          }
        )
        return () => {
          unsubscribe()
          isMounted = false
        }
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  console.log("useAuthentication: Returning:", { user, authLoading })
  return {
    user,
    authLoading,
    authError,
  }
}
