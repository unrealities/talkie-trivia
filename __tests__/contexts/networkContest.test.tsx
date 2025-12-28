import React from "react"
import { View, Text } from "react-native"
import { render, waitFor, screen, act } from "@testing-library/react-native"
import { NetworkProvider, useNetwork } from "../../src/contexts/networkContext"
import * as Network from "expo-network"
import { analyticsService } from "../../src/utils/analyticsService"

// Mocks
jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(),
  addNetworkStateListener: jest.fn(),
}))
jest.mock("../../src/utils/analyticsService")

// Helper Component to consume the context
const TestComponent = () => {
  const { isNetworkConnected } = useNetwork()
  return (
    <View>
      <Text testID="status">
        {isNetworkConnected === null
          ? "Unknown"
          : isNetworkConnected
          ? "Connected"
          : "Disconnected"}
      </Text>
    </View>
  )
}

describe("Context: NetworkContext", () => {
  let listenerCallback: ((state: Network.NetworkState) => void) | null = null

  beforeEach(() => {
    jest.clearAllMocks()
    // Setup default listener mock
    ;(Network.addNetworkStateListener as jest.Mock).mockImplementation((cb) => {
      listenerCallback = cb
      return { remove: jest.fn() }
    })
  })

  it("should initialize with the current network state", async () => {
    // Mock initial state: Connected
    ;(Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
      isInternetReachable: true,
    })

    render(
      <NetworkProvider>
        <TestComponent />
      </NetworkProvider>
    )

    // Should eventually show Connected
    await waitFor(() => {
      expect(screen.getByTestId("status").children[0]).toBe("Connected")
    })

    expect(analyticsService.trackNetworkStatusChange).toHaveBeenCalledWith(true)
  })

  it("should handle initial network failure (offline)", async () => {
    // Mock initial state: Disconnected (false)
    ;(Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
      isInternetReachable: false,
    })

    render(
      <NetworkProvider>
        <TestComponent />
      </NetworkProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("status").children[0]).toBe("Disconnected")
    })
  })

  it("should handle errors during initialization", async () => {
    // Mock failure
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
    ;(Network.getNetworkStateAsync as jest.Mock).mockRejectedValue(
      new Error("Network error")
    )

    render(
      <NetworkProvider>
        <TestComponent />
      </NetworkProvider>
    )

    // Should default to false (Disconnected) on error as per implementation
    await waitFor(() => {
      expect(screen.getByTestId("status").children[0]).toBe("Disconnected")
    })

    consoleSpy.mockRestore()
  })

  it("should update state when network listener fires", async () => {
    ;(Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
      isInternetReachable: true,
    })

    render(
      <NetworkProvider>
        <TestComponent />
      </NetworkProvider>
    )

    await waitFor(() => screen.getByText("Connected"))

    // Simulate disconnection
    expect(listenerCallback).toBeDefined()
    act(() => {
      // @ts-ignore
      listenerCallback({ isInternetReachable: false })
    })

    await waitFor(() => {
      expect(screen.getByTestId("status").children[0]).toBe("Disconnected")
    })

    expect(analyticsService.trackNetworkStatusChange).toHaveBeenCalledWith(
      false
    )
  })

  it("should throw error if useNetwork is used outside of provider", () => {
    // Suppress React console error for boundary test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    const BadComponent = () => {
      useNetwork()
      return null
    }

    expect(() => render(<BadComponent />)).toThrow(
      "useNetwork must be used within a NetworkProvider"
    )

    consoleSpy.mockRestore()
  })
})
