import { renderHook, act, waitFor } from "@testing-library/react-native"
import { useGoogleAuth } from "../src/utils/hooks/useGoogleAuth"
import { useIdTokenAuthRequest } from "expo-auth-session/providers/google"
import {
  getAuth,
  signInWithCredential,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth"
import { analyticsService } from "../src/utils/analyticsService"

// Mocks
jest.mock("firebase/auth")
jest.mock("../src/utils/analyticsService")

// Mock expo-constants
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      androidClientId: "android-id",
      expoClientId: "expo-id",
      iosClientId: "ios-id",
      webClientId: "web-id",
    },
  },
}))

// Properly mock the expo-auth-session provider
jest.mock("expo-auth-session/providers/google", () => ({
  useIdTokenAuthRequest: jest.fn(),
}))

describe("Hook: useGoogleAuth", () => {
  const mockOnAuthStateChange = jest.fn()
  const mockPromptAsync = jest.fn()
  const mockUseIdTokenAuthRequest = useIdTokenAuthRequest as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    // Default behavior: no request, no response, just the prompt function
    mockUseIdTokenAuthRequest.mockReturnValue([null, null, mockPromptAsync])
    ;(getAuth as jest.Mock).mockReturnValue({})
  })

  it("should initiate Google sign-in when handleSignIn is called", async () => {
    const { result } = renderHook(() => useGoogleAuth(mockOnAuthStateChange))

    await act(async () => {
      await result.current.handleSignIn()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.authError).toBeNull()
    expect(analyticsService.trackGoogleSignInStart).toHaveBeenCalled()
    expect(mockPromptAsync).toHaveBeenCalled()
  })

  it("should handle successful Google response and Firebase sign-in", async () => {
    const { result, rerender } = renderHook(() =>
      useGoogleAuth(mockOnAuthStateChange)
    )

    const mockUser = { uid: "test-uid" }
    ;(signInWithCredential as jest.Mock).mockResolvedValue({ user: mockUser })

    // Update mock to simulate successful response
    mockUseIdTokenAuthRequest.mockReturnValue([
      null,
      { type: "success", params: { id_token: "valid-token" } },
      mockPromptAsync,
    ])

    rerender()

    await waitFor(() => {
      expect(GoogleAuthProvider.credential).toHaveBeenCalledWith("valid-token")
      expect(signInWithCredential).toHaveBeenCalled()
      expect(analyticsService.trackGoogleSignInSuccess).toHaveBeenCalledWith(
        "test-uid"
      )
      expect(result.current.isLoading).toBe(false)
      expect(result.current.authError).toBeNull()
    })
  })

  it("should handle Firebase sign-in failure after Google success", async () => {
    const { result, rerender } = renderHook(() =>
      useGoogleAuth(mockOnAuthStateChange)
    )

    ;(signInWithCredential as jest.Mock).mockRejectedValue(
      new Error("Firebase Error")
    )

    mockUseIdTokenAuthRequest.mockReturnValue([
      null,
      { type: "success", params: { id_token: "valid-token" } },
      mockPromptAsync,
    ])

    rerender()

    await waitFor(() => {
      expect(result.current.authError).toContain(
        "Firebase sign-in error: Firebase Error"
      )
      expect(analyticsService.trackGoogleSignInFailure).toHaveBeenCalledWith(
        expect.any(String)
      )
      expect(result.current.isLoading).toBe(false)
    })
  })

  it("should handle Google sign-in errors directly", async () => {
    const { result, rerender } = renderHook(() =>
      useGoogleAuth(mockOnAuthStateChange)
    )

    mockUseIdTokenAuthRequest.mockReturnValue([
      null,
      { type: "error", error: { message: "Google Auth Failed" } },
      mockPromptAsync,
    ])

    rerender()

    await waitFor(() => {
      expect(result.current.authError).toContain(
        "Google sign-in error: Google Auth Failed"
      )
      expect(analyticsService.trackGoogleSignInFailure).toHaveBeenCalledWith(
        expect.any(String)
      )
      expect(result.current.isLoading).toBe(false)
    })
  })

  it("should handle sign out", async () => {
    const { result } = renderHook(() => useGoogleAuth(mockOnAuthStateChange))

    await act(async () => {
      await result.current.handleSignOut()
    })

    expect(analyticsService.trackSignOut).toHaveBeenCalled()
    expect(signOut).toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.authError).toBeNull()
  })

  it("should handle sign out errors", async () => {
    const { result } = renderHook(() => useGoogleAuth(mockOnAuthStateChange))
    ;(signOut as jest.Mock).mockRejectedValue(new Error("SignOut Failed"))

    await act(async () => {
      await result.current.handleSignOut()
    })

    expect(result.current.authError).toContain("Sign-out error: SignOut Failed")
    expect(result.current.isLoading).toBe(false)
  })
})
