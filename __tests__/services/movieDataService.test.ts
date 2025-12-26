import { MovieDataService } from "../../src/services/movieDataService"
import Constants from "expo-constants"

// Mock data matches the structure of popularMovies.json
const mockMoviesData = [
  {
    id: 101,
    title: "Movie A",
    overview: "Plot A",
    poster_path: "/a.jpg",
    release_date: "2020-01-01",
    tagline: "Tag A",
    imdb_id: "tt101",
    popularity: 10,
    vote_average: 8.0,
    vote_count: 100,
    genres: [{ id: 1, name: "Action" }],
    director: { name: "Director A", imdb_id: "nm1" },
    actors: [
      { id: 1, name: "Actor 1", imdb_id: "nm10", order: 0 },
      { id: 2, name: "Actor 2", imdb_id: "nm20", order: 1 },
    ],
  },
  {
    id: 102,
    title: "Movie B",
    release_date: "2021-01-01",
    overview: "Plot B",
    poster_path: "/b.jpg",
    genres: [],
    director: null,
    actors: [],
  },
  {
    id: 27205,
    title: "Inception",
    overview: "Dream within a dream",
    poster_path: "/inception.jpg",
    release_date: "2010-07-16",
    genres: [{ id: 878, name: "Science Fiction" }],
    director: { name: "Christopher Nolan" },
    actors: [],
    metadata: { imdb_id: "tt1375666" },
  },
]

jest.mock("../../data/popularMovies.json", () => mockMoviesData)

describe("Service: MovieDataService", () => {
  let service: MovieDataService

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset E2E flag
    if (Constants.expoConfig && Constants.expoConfig.extra) {
      Constants.expoConfig.extra.isE2E = false
    }

    jest.isolateModules(() => {
      const {
        MovieDataService: ServiceClass,
      } = require("../../src/services/movieDataService")
      service = new ServiceClass()
    })
  })

  describe("getItemById", () => {
    it("should return a fully populated TriviaItem", async () => {
      const item = await service.getItemById(101)
      expect(item).toBeDefined()
      expect(item?.id).toBe(101)
      expect(item?.title).toBe("Movie A")

      const directorHint = item?.hints.find((h) => h.type === "director")
      expect(directorHint?.value).toBe("Director A")
    })

    it("should handle sparse data gracefully", async () => {
      const item = await service.getItemById(102)
      expect(item).toBeDefined()
      expect(item?.title).toBe("Movie B")
      const directorHint = item?.hints.find((h) => h.type === "director")
      expect(directorHint?.value).toBe("N/A")
    })

    it("should return null if not found", async () => {
      const item = await service.getItemById(999)
      expect(item).toBeNull()
    })

    // E2E Test Cases
    it("should return Inception mock in E2E mode for ID 27205", async () => {
      if (Constants.expoConfig && Constants.expoConfig.extra) {
        Constants.expoConfig.extra.isE2E = true
      }

      const result = await service.getItemById(27205)
      expect(result).not.toBeNull()
      expect(result?.title).toBe("Inception")
      expect(result?.metadata.imdb_id).toBe("tt1375666")
    })

    it("should return Inception mock in E2E mode for ID '27205' (string input)", async () => {
      if (Constants.expoConfig && Constants.expoConfig.extra) {
        Constants.expoConfig.extra.isE2E = true
      }

      const result = await service.getItemById("27205")
      expect(result?.title).toBe("Inception")
    })
  })

  describe("getDailyTriviaItemAndLists", () => {
    it("should return daily item based on day of year", async () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date("2023-01-01T12:00:00.000Z"))

      const result = await service.getDailyTriviaItemAndLists()

      expect(result.dailyItem).toBeDefined()
      expect(result.fullItems).toHaveLength(3)
      expect(result.basicItems).toHaveLength(3)

      jest.useRealTimers()
    })

    it("should return Inception in E2E mode", async () => {
      if (Constants.expoConfig && Constants.expoConfig.extra) {
        Constants.expoConfig.extra.isE2E = true
      }
      const result = await service.getDailyTriviaItemAndLists()
      expect(result.dailyItem.title).toBe("Inception")
    })

    it("should throw error if data source is empty", async () => {
      jest.isolateModules(() => {
        jest.doMock("../../data/popularMovies.json", () => [])
        const {
          MovieDataService: EmptyService,
        } = require("../../src/services/movieDataService")
        const emptyService = new EmptyService()

        expect(emptyService.getDailyTriviaItemAndLists()).rejects.toThrow(
          "Local movie data is missing"
        )
      })
    })
  })
})
