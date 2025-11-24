import { Platform } from "react-native"
import * as Haptics from "expo-haptics"
import { hapticsService } from "../../src/utils/hapticsService"

jest.mock("expo-haptics")

describe("Utils: hapticsService", () => {
  const originalPlatform = Platform.OS

  afterEach(() => {
    Object.defineProperty(Platform, "OS", { get: () => originalPlatform })
    jest.clearAllMocks()
  })

  describe("Native Platform (iOS/Android)", () => {
    beforeEach(() => {
      Object.defineProperty(Platform, "OS", { get: () => "ios" })
    })

    it("should call impactAsync for light/medium/heavy", () => {
      hapticsService.light()
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      )

      hapticsService.medium()
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      )

      hapticsService.heavy()
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Heavy
      )
    })

    it("should call notificationAsync for success/warning/error", () => {
      hapticsService.success()
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success
      )

      hapticsService.warning()
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Warning
      )

      hapticsService.error()
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Error
      )
    })
  })

  describe("Web Platform", () => {
    beforeEach(() => {
      Object.defineProperty(Platform, "OS", { get: () => "web" })
    })

    it("should NOT call Haptics methods on web", () => {
      hapticsService.light()
      hapticsService.success()

      expect(Haptics.impactAsync).not.toHaveBeenCalled()
      expect(Haptics.notificationAsync).not.toHaveBeenCalled()
    })
  })
})
