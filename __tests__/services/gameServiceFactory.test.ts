import { getGameDataService } from "../../src/services/gameServiceFactory"
import { MovieDataService } from "../../src/services/movieDataService"
import { VideoGameService } from "../../src/services/videoGameService"

// Mocks
jest.mock("../../src/services/movieDataService")
jest.mock("../../src/services/videoGameService")

describe("Service: gameServiceFactory", () => {
  it("should return MovieDataService for 'movies' mode", () => {
    const service = getGameDataService("movies")
    expect(service).toBeInstanceOf(MovieDataService)
  })

  it("should return VideoGameService for 'videoGames' mode", () => {
    const service = getGameDataService("videoGames")
    expect(service).toBeInstanceOf(VideoGameService)
  })

  it("should throw an error for an unknown game mode", () => {
    // @ts-ignore - Testing invalid input
    expect(() => getGameDataService("invalid_mode")).toThrow(
      "No game data service found for mode: invalid_mode"
    )
  })
})
