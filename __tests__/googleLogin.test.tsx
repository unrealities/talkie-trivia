import React from "react"
import { fireEvent, waitFor } from "@testing-library/react-native"
import GoogleLogin from "../src/components/googleLogin"
import { render } from "../utils/test-utils" // Use the custom render
import { useAuth } from "../src/contexts/AuthContext"

// Mock the useAuth hook
jest.mock("../src/contexts/AuthContext")
const mockedUseAuth = useAuth as jest.Mock

describe("GoogleLogin", () => {
  const mockHandleSignIn = jest.fn()
  const mockHandleSignOut = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // Default mock implementation
    mockedUseAuth.mockReturnValue({
      player: null,
      user: null,
      isSigningIn: false,
      error: null,
      handleSignIn: mockHandleSignIn,
      handleSignOut: mockHandleSignOut,
    })
  })

  it('renders "Sign In with Google" button when not signed in', () => {
    const { getByText } = render(<GoogleLogin />)
    expect(getByText("Sign In with Google")).toBeTruthy()
  })

  it('calls handleSignIn when "Sign In with Google" button is pressed', () => {
    const { getByText } = render(<GoogleLogin />)
    fireEvent.press(getByText("Sign In with Google"))
    expect(mockHandleSignIn).toHaveBeenCalled()
  })

  it('renders "Sign Out {displayName}" button when signed in', () => {
    mockedUseAuth.mockReturnValue({
      ...mockedUseAuth(),
      user: { isAnonymous: false, displayName: "Test User" },
      player: { name: "Test User" },
    })
    const { getByText } = render(<GoogleLogin />)
    expect(getByText("Sign Out Test User")).toBeTruthy()
  })

  it('calls handleSignOut when "Sign Out" button is pressed', () => {
    mockedUseAuth.mockReturnValue({
      ...mockedUseAuth(),
      user: { isAnonymous: false, displayName: "Test User" },
      player: { name: "Test User" },
    })
    const { getByText } = render(<GoogleLogin />)
    fireEvent.press(getByText("Sign Out Test User"))
    expect(mockHandleSignOut).toHaveBeenCalled()
  })

  it("shows ActivityIndicator and is disabled when isSigningIn is true", async () => {
    mockedUseAuth.mockReturnValue({
      ...mockedUseAuth(),
      isSigningIn: true,
    })
    const { getByTestId } = render(<GoogleLogin />)

    const activityIndicator = getByTestId("activityIndicator")
    expect(activityIndicator).toBeTruthy()
    expect(getByTestId("googleButton").props.disabled).toBe(true)
  })
})
