import { getPerformance } from "firebase/performance"
import { getAnalytics, isSupported, Analytics } from "firebase/analytics"
import { app } from "../services/firebaseClient"
import { Platform } from "react-native"

let analytics: Analytics | undefined
let perf: any
;(async () => {
  if (__DEV__) return

  try {
    const supported = await isSupported()
    if (supported) {
      analytics = getAnalytics(app)
    }
  } catch (error) {
    // Ignore
  }
})()

if (Platform.OS === "web" && !__DEV__) {
  try {
    perf = getPerformance(app)
  } catch (e) {
    // Ignore
  }
}

export { perf, analytics }
