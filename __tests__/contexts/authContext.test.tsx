import React from "react"
import { View, Text } from "react-native"
import { render, screen, waitFor, act } from "@testing-library/react-native"
import { AuthProvider, useAuth } from "../../src/contexts/authContext"
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { gameService } from "../../src/services/gameService"

// Mocks
jest.mock("firebase/auth")
jest.mock("../../src/services/gameService")
jest.mock("../../src/utils/analyticsService")
jest.mock("../../src/utils/hooks/useGoogleAuth", () => ({
  useGoogleAuth: () => ({
    isLoading: false,
    authError: null,
    handleSignIn: jest.fn(),
    handleSignOut: jest.fn(),
  }),
}))

// Component to consume context
const TestConsumer = () => {
  const { user, player, loading, error } = useAuth()
  return (
    <View>
      <Text testID="status">{loading ? "Loading" : "Ready"}</Text>
      <Text testID="error">{error ? error : "No Error"}</Text>
      <Text testID="user">{user ? "User Logged In" : "No User"}</Text>
      <Text testID="player">
        {player ? `Player: ${player.name}` : "No Player"}
      </Text>
    </View>
  )
}

describe("AuthContext", () => {
  let authStateCallback: (user: any) => void

  beforeEach(() => {
    jest.clearAllMocks()

    // Capture the auth listener callback
    ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      authStateCallback = callback
      return jest.fn() // Unsubscribe mock
    })

    ;(getAuth as jest.Mock).mockReturnValue({})
  })

  it("initializes in loading state", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    expect(screen.getByTestId("status")).toHaveTextContent("Loading")
  })

  it("handles successful login and fetches player data", async () => {
    const mockFirebaseUser = { uid: "123", isAnonymous: true }
    const mockPlayer = { id: "123", name: "Guest Player" }

    ;(gameService.ensurePlayerExists as jest.Mock).mockResolvedValue(mockPlayer)

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Simulate Firebase emitting a user
    await act(async () => {
      authStateCallback(mockFirebaseUser)
    })

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("Ready")
      expect(screen.getByTestId("user")).toHaveTextContent("User Logged In")
      expect(screen.getByTestId("player")).toHaveTextContent(
        "Player: Guest Player"
      )
    })
  })

  it("handles login failure gracefully", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Simulate Firebase auth failing immediately inside the listener logic (e.g. ensurePlayerExists fails)
    const errorMsg = "Network Error"
    ;(gameService.ensurePlayerExists as jest.Mock).mockRejectedValue(
      new Error(errorMsg)
    )

    await act(async () => {
      authStateCallback({ uid: "123" })
    })

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("Ready")
      // FIX: Match the full error string provided by the context ("Authentication failed: ...")
      expect(screen.getByTestId("error")).toHaveTextContent(
        `Authentication failed: ${errorMsg}`
      )
      expect(screen.getByTestId("player")).toHaveTextContent("No Player")
    })
  })

  it("signs in anonymously if no user exists", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Simulate Firebase returning null (no user logged in)
    await act(async () => {
      authStateCallback(null)
    })

    expect(signInAnonymously).toHaveBeenCalled()
  })
})
