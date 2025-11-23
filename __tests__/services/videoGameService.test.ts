import { VideoGameService } from "../../src/services/videoGameService"

describe("Service: VideoGameService", () => {
  let service: VideoGameService

  beforeEach(() => {
    service = new VideoGameService()
  })

  it("should define the correct mode", () => {
    expect(service.mode).toBe("videoGames")
  })

  it("should throw error when calling getDailyTriviaItemAndLists", async () => {
    await expect(service.getDailyTriviaItemAndLists()).rejects.toThrow(
      "Video game mode is not available yet."
    )
  })

  it("should throw error when calling getItemById", async () => {
    await expect(service.getItemById(1)).rejects.toThrow(
      "VideoGameService.getItemById is not yet implemented."
    )
  })
})
