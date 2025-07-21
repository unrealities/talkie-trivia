import { Platform } from "react-native"
import * as Haptics from "expo-haptics"

/**
 * A wrapper for expo-haptics to provide type-safe haptic feedback
 * and automatically handle platform differences (no-op on web).
 */

const trigger = (feedbackType: Haptics.ImpactFeedbackStyle): void => {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(feedbackType)
  }
}

const notify = (notificationType: Haptics.NotificationFeedbackType): void => {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(notificationType)
  }
}

export const hapticsService = {
  /** Use for light taps, UI toggles, and minor interactions. */
  light: () => trigger(Haptics.ImpactFeedbackStyle.Light),

  /** Use for standard button presses and primary actions. */
  medium: () => trigger(Haptics.ImpactFeedbackStyle.Medium),

  /** Use for more significant but non-critical actions. */
  heavy: () => trigger(Haptics.ImpactFeedbackStyle.Heavy),

  // --- Notifications ---
  /** Use when an action is successful. */
  success: () => notify(Haptics.NotificationFeedbackType.Success),

  /** Use when an action results in a warning. */
  warning: () => notify(Haptics.NotificationFeedbackType.Warning),

  /** Use when an action fails or an error occurs. */
  error: () => notify(Haptics.NotificationFeedbackType.Error),
}
