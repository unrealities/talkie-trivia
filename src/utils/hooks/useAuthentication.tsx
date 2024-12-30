import { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { firebaseConfig } from "../../config/firebase"
import { setUserName } from "../hooks/localStore"

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export function useAuthentication() {
  const [user, setUser] = useState<User | null>(null) // Start with null
  const [authLoading, setAuthLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setUser(user)
          setUserName(user.displayName || "no name")
        } else {
          setUser(null) // Explicitly set to null when logged out
        }
        setAuthLoading(false) // Set loading to false when auth state is known
      }
    )

    return unsubscribeFromAuthStatusChanged
  }, [])

  return {
    user,
    authLoading,
  }
}
