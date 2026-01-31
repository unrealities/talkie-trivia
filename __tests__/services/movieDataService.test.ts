// --- MOCK DATA ---
const mockBasicMovies = [
  {
    id: 101,
    title: "Movie A",
    release_date: "2020-01-01",
    poster_path: "/a.jpg",
  },
  {
    id: 102,
    title: "Movie B",
    release_date: "2021-01-01",
    poster_path: "/b.jpg",
  },
]

const mockLiteMovies = [
  { id: 101, d: "Director A", g: ["Action"], c: ["Actor 1"], y: "2020" },
  { id: 102, d: "Director B", g: ["Comedy"], c: ["Actor 2"], y: "2021" },
]

const mockCloudMovie = {
  id: 101,
  title: "Movie A",
  overview: "Original Bad Plot",
  manual_overview: "Better Manual Plot",
  poster_path: "/a.jpg",
  release_date: "2020-01-01",
  tagline: "Cloud Tagline",
  imdb_id: "tt101",
  popularity: 10,
  vote_average: 8.0,
  vote_count: 100,
  genres: [{ id: 1, name: "Action" }],
  director: { id: 1, name: "Director A", imdb_id: "nm1" },
  actors: [{ id: 10, name: "Actor 1", imdb_id: "nm10", order: 0 }],
}

// --- MOCKS ---
jest.mock("../../src/data/basicMovies.json", () => mockBasicMovies)
jest.mock("../../src/data/moviesLite.json", () => mockLiteMovies)

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}))

jest.mock("../../src/services/firebaseClient", () => ({
  db: {},
}))

describe("Service: MovieDataService", () => {
  let MovieDataServiceClass: any
  let service: any
  let getDocMock: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    const firestore = require("firebase/firestore")
    getDocMock = firestore.getDoc

    const mod = require("../../src/services/movieDataService")
    MovieDataServiceClass = mod.MovieDataService
    service = new MovieDataServiceClass()
  })

  describe("getDailyTriviaItemAndLists", () => {
    it("should fetch the scheduled daily game", async () => {
      const mockDailyGameSnap = {
        exists: () => true,
        data: () => ({ movieId: 101 }),
      }

      const mockMovieSnap = {
        exists: () => true,
        data: () => mockCloudMovie,
      }

      getDocMock
        .mockResolvedValueOnce(mockDailyGameSnap)
        .mockResolvedValueOnce(mockMovieSnap)

      const result = await service.getDailyTriviaItemAndLists()

      expect(result.dailyItem.title).toBe("Movie A")
      expect(result.dailyItem.description).toBe("Full Cloud Plot")
      expect(result.dailyItem.hints[0].value).toBe("Director A")
      expect(result.dailyItem.description).toBe("Better Manual Plot")
      expect(result.basicItems).toHaveLength(2)
    })

    it("should throw an error if Firestore fails", async () => {
      getDocMock.mockRejectedValue(new Error("Network Error"))

      await expect(service.getDailyTriviaItemAndLists()).rejects.toThrow(
        "Unable to load the daily challenge",
      )
    })
  })

  describe("getItemById", () => {
    it("should fetch full details from Firestore", async () => {
      const mockSnap = {
        exists: () => true,
        data: () => mockCloudMovie,
      }
      getDocMock.mockResolvedValue(mockSnap)

      const item = await service.getItemById(101)
      expect(item).toBeDefined()
      expect(item?.title).toBe("Movie A")
      expect(item?.metadata.tagline).toBe("Cloud Tagline")
    })
  })
})
