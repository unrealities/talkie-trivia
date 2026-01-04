import { useEffect } from "react"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import { useGameStore } from "../../state/gameStore"
import { useShallow } from "zustand/react/shallow"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export const useNotifications = () => {
  const { currentStreak } = useGameStore(
    useShallow((state) => ({
      currentStreak: state.playerStats.currentStreak,
    }))
  )

  useEffect(() => {
    registerForPushNotificationsAsync()
  }, [])

  // Whenever streak changes (user plays), update the scheduled notification
  useEffect(() => {
    scheduleDailyNotification(currentStreak)
  }, [currentStreak])

  return {}
}

async function scheduleDailyNotification(currentStreak: number) {
  await Notifications.cancelAllScheduledNotificationsAsync()

  const title = "Talkie Trivia 🎬"
  let body = "The daily movie is live! Can you guess it?"

  if (currentStreak > 0) {
    body = `The daily movie is live! Keep your ${currentStreak}-day streak alive! 🔥`
  } else {
    body = "The daily movie is live! Start a new winning streak today!"
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    } as any,
  })
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "web") return

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!")
    return
  }
}
