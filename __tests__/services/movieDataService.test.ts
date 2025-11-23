import { MovieDataService } from "../../src/services/movieDataService"

// Mock data
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
    director: { name: "Director B" },
    actors: [],
  },
]

jest.mock("../../data/popularMovies.json", () => mockMoviesData)

describe("Service: MovieDataService", () => {
  let service: MovieDataService

  beforeEach(() => {
    jest.isolateModules(() => {
      const {
        MovieDataService: ServiceClass,
      } = require("../../src/services/movieDataService")
      service = new ServiceClass()
    })
  })

  describe("getItemById", () => {
    it("should return a transformed TriviaItem if found", async () => {
      const item = await service.getItemById(101)

      expect(item).toBeDefined()
      expect(item?.id).toBe(101)
      expect(item?.title).toBe("Movie A")
      expect(item?.hints).toHaveLength(4)

      const directorHint = item?.hints.find((h) => h.type === "director")
      expect(directorHint?.value).toBe("Director A")
    })

    it("should return null if not found", async () => {
      const item = await service.getItemById(999)
      expect(item).toBeNull()
    })
  })

  describe("getDailyTriviaItemAndLists", () => {
    it("should return daily item based on day of year", async () => {
      // Mock Date to ensure deterministic selection
      jest.useFakeTimers()
      jest.setSystemTime(new Date("2023-01-01T12:00:00.000Z"))

      const result = await service.getDailyTriviaItemAndLists()
      const expectedId = 102

      expect(result.dailyItem.id).toBe(expectedId)
      expect(result.fullItems).toHaveLength(2)
      expect(result.basicItems).toHaveLength(2)

      // Verify basic items transformation
      expect(result.basicItems[0]).toEqual({
        id: 101,
        title: "Movie A",
        releaseDate: "2020-01-01",
        posterPath: "/a.jpg",
      })

      jest.useRealTimers()
    })
  })
})
