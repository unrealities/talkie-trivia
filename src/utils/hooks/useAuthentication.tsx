import React, { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { firebaseConfig } from '../../config/firebase'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export function useAuthentication() {
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const unsubscribeFromAuthStatusChanged = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                alert("hello")
                alert("name: " + user.displayName + " email: " + user.email)
                setUser(user)
            } else {
                // User is signed out
                alert("good bye")
                setUser(undefined)
            }
        })

        return unsubscribeFromAuthStatusChanged
    }, [])

    return {
        user
    }
}
