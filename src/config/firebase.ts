import { getPerformance } from "firebase/performance"
import { getAnalytics, isSupported, Analytics } from "firebase/analytics"
import { app } from "../services/firebaseClient"
import { Platform } from "react-native"

let analytics: Analytics | undefined
let perf: any

;(async () => {
  try {
    const supported = await isSupported()
    if (supported) {
      analytics = getAnalytics(app)
    }
  } catch (error) {
  }
})()

if (Platform.OS === "web") {
  try {
    perf = getPerformance(app)
  } catch (e) {
    // Ignore
  }
}

export { perf, analytics }
