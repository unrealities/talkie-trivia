import React from "react"
import { render, screen } from "@testing-library/react-native"
import PlayerStatsContainer from "../src/components/playerStats"
import Player from "../src/models/player"
import PlayerStats from "../src/models/playerStats"

// Mock the WinChart component
jest.mock("../src/components/winChart", () => ({
  __esModule: true,
  default: ({ wins }: { wins: number }) => {
    return <></>
  },
}))

describe("PlayerStatsContainer", () => {
  const mockPlayer: Player = {
    id: "123",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: null,
  }

  const mockPlayerStats: PlayerStats = {
    games: 10,
    wins: 5,
    currentStreak: 3,
    maxStreak: 5,
    hintsAvailable: 2,
  }

  it("renders correctly with valid props", () => {
    render(
      <PlayerStatsContainer player={mockPlayer} playerStats={mockPlayerStats} />
    )

    expect(screen.getByLabelText("Player Statistics")).toBeTruthy()
    expect(screen.getByText("Games Played")).toBeTruthy()
    expect(screen.getByText("10")).toBeTruthy()
    expect(screen.getByText("Current Streak")).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
    expect(screen.getByText("Max Streak")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
    expect(screen.getByText("Hints Available")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
  })

  it("renders null when player prop is missing", () => {
    render(
      <PlayerStatsContainer
        player={null as any}
        playerStats={mockPlayerStats}
      />
    )
    expect(screen.queryByLabelText("Player Statistics")).toBeNull()
  })

  it("renders null when playerStats prop is missing", () => {
    render(
      <PlayerStatsContainer player={mockPlayer} playerStats={null as any} />
    )
    expect(screen.queryByLabelText("Player Statistics")).toBeNull()
  })

  it("renders null when props are missing", () => {
    render(
      <PlayerStatsContainer player={null as any} playerStats={null as any} />
    )
    expect(screen.queryByLabelText("Player Statistics")).toBeNull()
  })

  it("renders null when props are empty object", () => {
    render(<PlayerStatsContainer {...({} as any)} />)
    expect(screen.queryByLabelText("Player Statistics")).toBeNull()
  })
})
