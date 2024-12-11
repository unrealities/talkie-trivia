import React, { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { firebaseConfig } from "../../config/firebase"
import { setUserName } from "../hooks/localStore"

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export function useAuthentication() {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setUser(user)
          setUserName(user.displayName || "no name")
        } else {
          setUser(undefined)
        }
      }
    )

    return unsubscribeFromAuthStatusChanged
  }, [])

  return {
    user,
  }
}
