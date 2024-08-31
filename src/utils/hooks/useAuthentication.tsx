import React, { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { firebaseConfig } from '../../config/firebase'
import { setUserName } from '../hooks/localStore'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export function useAuthentication() {
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const unsubscribeFromAuthStatusChanged = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser(user)
                setUserName(user.displayName || "no name")
            } else {
                // User is signed out]
                setUser(undefined)
            }
        })

        return unsubscribeFromAuthStatusChanged
    }, [])

    return {
        user
    }
}
