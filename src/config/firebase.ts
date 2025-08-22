import { getPerformance } from "firebase/performance"
import { getAnalytics, isSupported, Analytics } from "firebase/analytics"
import { app } from "../services/firebaseClient"

let analytics: Analytics | undefined

;(async () => {
  try {
    const supported = await isSupported()
    if (supported) {
      analytics = getAnalytics(app)
      if (__DEV__) {
        console.log("firebase.tsx: Firebase Analytics initialized.")
      }
    } else {
      if (__DEV__) {
        console.log(
          "firebase.tsx: Firebase Analytics not supported in this environment."
        )
      }
    }
  } catch (error) {
    console.error("firebase.tsx: Error checking Analytics support:", error)
  }
})()

const perf = getPerformance(app)

export { perf, analytics }
