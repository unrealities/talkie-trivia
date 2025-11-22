import { renderHook, act } from "@testing-library/react-native"
import { Alert } from "react-native"
import * as Linking from "expo-linking"
import { useExternalLink } from "../src/utils/hooks/useExternalLink"

// Mocks
jest.mock("expo-linking", () => ({
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
}))
jest.spyOn(Alert, "alert")

describe("Hook: useExternalLink", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should alert if the URL is missing", async () => {
    const { result } = renderHook(() => useExternalLink())

    await act(async () => {
      // @ts-ignore - testing null input
      await result.current.openLink(null)
    })

    expect(Alert.alert).toHaveBeenCalledWith(
      "Link Unavailable",
      "No link was found for this item."
    )
    expect(Linking.canOpenURL).not.toHaveBeenCalled()
  })

  it("should open the URL if it is supported", async () => {
    ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(true)
    const { result } = renderHook(() => useExternalLink())
    const testUrl = "https://example.com"

    await act(async () => {
      await result.current.openLink(testUrl)
    })

    expect(Linking.canOpenURL).toHaveBeenCalledWith(testUrl)
    expect(Linking.openURL).toHaveBeenCalledWith(testUrl)
    expect(Alert.alert).not.toHaveBeenCalled()
  })

  it("should alert if the URL is not supported", async () => {
    ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(false)
    const { result } = renderHook(() => useExternalLink())
    const testUrl = "invalid-scheme://test"

    await act(async () => {
      await result.current.openLink(testUrl)
    })

    expect(Linking.canOpenURL).toHaveBeenCalledWith(testUrl)
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(Alert.alert).toHaveBeenCalledWith(
      "Unsupported Link",
      expect.stringContaining(testUrl)
    )
  })

  it("should alert if checking/opening the link throws an error", async () => {
    const errorMsg = "Network error"
    ;(Linking.canOpenURL as jest.Mock).mockRejectedValue(new Error(errorMsg))
    const { result } = renderHook(() => useExternalLink())

    await act(async () => {
      await result.current.openLink("https://example.com")
    })

    expect(Alert.alert).toHaveBeenCalledWith(
      "Link Error",
      expect.stringContaining(errorMsg)
    )
  })
})
