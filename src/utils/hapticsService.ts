import { Platform } from "react-native"
import * as Haptics from "expo-haptics"

// Wrapper for type-safe haptic feedback; silent on web.
const trigger = (feedbackType) => {
  if (Platform.OS !== "web") Haptics.impactAsync(feedbackType)
}
const notify = (notificationType) => {
  if (Platform.OS !== "web") Haptics.notificationAsync(notificationType)
}

export const hapticsService = {
  // Light tap for minor interactions
  light: () => trigger(Haptics.ImpactFeedbackStyle.Light),
  // Medium tap for core actions like guess submit or hint reveal
  medium: () => trigger(Haptics.ImpactFeedbackStyle.Medium),
  // Heavy tap for win or loss
  heavy: () => trigger(Haptics.ImpactFeedbackStyle.Heavy),
  // Use notify for major status updates (win/lose)
  success: () => notify(Haptics.NotificationFeedbackType.Success),
  warning: () => notify(Haptics.NotificationFeedbackType.Warning),
  error: () => notify(Haptics.NotificationFeedbackType.Error),
}
