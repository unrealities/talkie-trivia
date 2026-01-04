import { renderHook, waitFor } from "@testing-library/react-native"
import { useNotifications } from "../../../src/utils/hooks/useNotifications"
import * as Notifications from "expo-notifications"
import { useGameStore } from "../../../src/state/gameStore"
import { defaultPlayerStats } from "../../../src/models/default"
import { Platform } from "react-native"

// Mock expo-notifications
jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}))

describe("Hook: useNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset store
    useGameStore.setState({
      playerStats: { ...defaultPlayerStats, currentStreak: 0 },
    })
    // Default permission mock
    ;(Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    })
    ;(Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    })
  })

  it("should request permissions on mount", async () => {
    ;(Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "undetermined",
    })

    renderHook(() => useNotifications())

    await waitFor(() => {
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled()
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled()
    })
  })

  it("should schedule a generic notification if streak is 0", async () => {
    renderHook(() => useNotifications())

    await waitFor(() => {
      expect(
        Notifications.cancelAllScheduledNotificationsAsync
      ).toHaveBeenCalled()
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            body: expect.stringContaining("Start a new winning streak"),
          }),
        })
      )
    })
  })

  it("should schedule a specific streak notification if streak > 0", async () => {
    useGameStore.setState({
      playerStats: { ...defaultPlayerStats, currentStreak: 5 },
    })

    renderHook(() => useNotifications())

    await waitFor(() => {
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            body: expect.stringContaining("Keep your 5-day streak alive"),
          }),
        })
      )
    })
  })

  it("should NOT schedule if platform is Web", async () => {
    Platform.OS = "web"
    renderHook(() => useNotifications())

    expect(Notifications.getPermissionsAsync).not.toHaveBeenCalled()

    Platform.OS = "ios"
  })
})
