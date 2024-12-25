import React from "react"
import { render, screen } from "@testing-library/react-native"
import PlayerStatsContainer from "../src/components/playerStats"
import Player from "../src/models/player"
import PlayerStats from "../src/models/playerStats"

describe("PlayerStatsContainer", () => {
  const mockPlayer: Player = { id: "player1", name: "Test Player" }
  const mockPlayerStats: PlayerStats = {
    id: "playerStats1",
    currentStreak: 3,
    games: 10,
    maxStreak: 5,
    wins: [1, 2, 3, 4, 5],
  }

  it("renders player stats correctly", () => {
    render(
      <PlayerStatsContainer player={mockPlayer} playerStats={mockPlayerStats} />
    )

    expect(screen.getByText("Games Played")).toBeTruthy()
    expect(screen.getByText("10")).toBeTruthy()
    expect(screen.getByText("Current Streak")).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
    expect(screen.getByText("Max Streak")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
    // You might want to mock or test the WinChart rendering separately
  })

  it("renders WinChart with correct data", () => {
    render(
      <PlayerStatsContainer player={mockPlayer} playerStats={mockPlayerStats} />
    )

    // Check if the VictoryPie component is rendered within PlayerStatsContainer
    expect(screen.getByTestId("victory-pie-chart")).toBeTruthy()
  })
})
