import React from "react"
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native"
import * as Google from "expo-auth-session/providers/google"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  AuthError,
} from "firebase/auth"
import GoogleLogin from "../src/components/googleLogin"
import Player from "../src/models/player"

// Mock Firebase and Google auth
jest.mock("firebase/auth")
jest.mock("expo-auth-session/providers/google")

// Helper function to create a mock user for testing
const createMockUser = (uid: string, displayName: string) => ({
  uid,
  displayName,
})

describe("GoogleLogin", () => {
  const mockPlayer: Player = {
    id: "test-player-id",
    name: "Test Player",
  }

  const mockOnAuthStateChange = jest.fn()

  beforeEach(() => {
    ;(Google.useIdTokenAuthRequest as jest.Mock).mockReturnValue([
      {},
      { type: "success", params: { id_token: "mock-id-token" } },
      jest.fn(),
    ])
    ;(getAuth as jest.Mock).mockReturnValue({}) // Mock auth object
    ;(GoogleAuthProvider.credential as jest.Mock).mockReturnValue(
      "mock-credential"
    )
    ;(signInWithCredential as jest.Mock).mockResolvedValue({
      user: createMockUser("test-user-id", "Test User"),
    })
    ;(signOut as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
    mockOnAuthStateChange.mockClear()
  })

  it("displays 'Sign In with Google' when no player is present", () => {
    render(<GoogleLogin player={{ id: "", name: "" }} />)
    expect(screen.getByText("Sign In with Google")).toBeTruthy()
  })

  it("displays 'Sign Out [Player Name]' when a player is present", () => {
    render(<GoogleLogin player={mockPlayer} />)
    expect(screen.getByText("Sign Out Test Player")).toBeTruthy()
  })

  it("shows loading indicator during sign-in process", async () => {
    const mockPromptAsync = jest.fn(() =>
      Promise.resolve({
        type: "success",
        params: { id_token: "mock-id-token" },
      })
    )
    ;(Google.useIdTokenAuthRequest as jest.Mock).mockReturnValue([
      null,
      null,
      mockPromptAsync,
    ])

    render(
      <GoogleLogin
        player={{ id: "", name: "" }}
        onAuthStateChange={mockOnAuthStateChange}
      />
    )

    fireEvent.press(screen.getByText("Sign In with Google"))
    expect(screen.getByRole("progressbar")).toBeTruthy()
  })

  it("handles sign-in errors", async () => {
    const mockAuthError: AuthError = {
      code: "auth/network-request-failed",
      message: "Network error",
      name: "FirebaseError",
      stack: "",
    }
    const mockPromptAsync = jest.fn(() => Promise.reject(mockAuthError))
    ;(Google.useIdTokenAuthRequest as jest.Mock).mockReturnValue([
      null,
      null,
      mockPromptAsync,
    ])
    ;(signInWithCredential as jest.Mock).mockRejectedValue(mockAuthError)
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {})

    render(
      <GoogleLogin
        player={{ id: "", name: "" }}
        onAuthStateChange={mockOnAuthStateChange}
      />
    )

    fireEvent.press(screen.getByText("Sign In with Google"))
    await waitFor(() =>
      expect(signInWithCredential).rejects.toThrow(mockAuthError)
    )

    expect(alertSpy).toHaveBeenCalledWith(
      "Authentication Error",
      "Network error. Check your connection."
    )
    expect(
      screen.getByText("Network error. Check your connection.")
    ).toBeTruthy()

    // Verify that error message is displayed
    expect(
      screen.getByText("Network error. Check your connection.")
    ).toBeTruthy()
  })

  it("calls onAuthStateChange with updated player on successful sign-in", async () => {
    const mockPromptAsync = jest.fn(() =>
      Promise.resolve({
        type: "success",
        params: { id_token: "mock-id-token" },
      })
    )
    ;(Google.useIdTokenAuthRequest as jest.Mock).mockReturnValue([
      null,
      null,
      mockPromptAsync,
    ])

    render(
      <GoogleLogin
        player={{ id: "", name: "" }}
        onAuthStateChange={mockOnAuthStateChange}
      />
    )

    fireEvent.press(screen.getByText("Sign In with Google"))
    await waitFor(() => expect(mockPromptAsync).toHaveBeenCalled())

    // Check if onAuthStateChange is called with a mock user based on signed in user
    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalledWith({
        id: "test-user-id",
        name: "Test User",
      })
    })
  })

  it("calls onAuthStateChange with null on successful sign-out", async () => {
    render(
      <GoogleLogin
        player={mockPlayer}
        onAuthStateChange={mockOnAuthStateChange}
      />
    )

    fireEvent.press(screen.getByText("Sign Out Test Player"))

    await waitFor(() => expect(signOut).toHaveBeenCalled())
    expect(mockOnAuthStateChange).toHaveBeenCalledWith(null)
  })

  it("handles sign-out errors", async () => {
    ;(signOut as jest.Mock).mockRejectedValue(new Error("Sign out error"))
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {})

    render(
      <GoogleLogin
        player={mockPlayer}
        onAuthStateChange={mockOnAuthStateChange}
      />
    )

    fireEvent.press(screen.getByText("Sign Out Test Player"))
    await waitFor(() => expect(signOut).rejects.toThrow("Sign out error"))

    expect(alertSpy).toHaveBeenCalledWith(
      "Sign Out Error",
      "Failed to sign out. Please try again."
    )
  })
})
