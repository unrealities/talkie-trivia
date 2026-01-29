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
  overview: "Full Cloud Plot",
  poster_path: "/a.jpg",
  release_date: "2020-01-01",
  tagline: "Cloud Tagline",
  imdb_id: "tt101",
  popularity: 10,
  vote_average: 8.0,
  vote_count: 100,
  genres: [{ id: 1, name: "Action" }],
  director: { name: "Director A", imdb_id: "nm1" },
  actors: [{ name: "Actor 1", imdb_id: "nm10", order: 0 }],
}

// --- MOCKS ---
// Mock the local JSON imports
jest.mock("../../data/basicMovies.json", () => mockBasicMovies)
jest.mock("../../data/moviesLite.json", () => mockLiteMovies)

// Mock Firebase
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

    // 1. Grab the fresh reference to the mock from the reset module registry
    const firestore = require("firebase/firestore")
    getDocMock = firestore.getDoc

    // 2. Require the service (it will use the firestore module we just grabbed)
    const mod = require("../../src/services/movieDataService")
    MovieDataServiceClass = mod.MovieDataService
    service = new MovieDataServiceClass()
  })

  describe("getDailyTriviaItemAndLists", () => {
    it("should fetch the scheduled daily game from Firestore", async () => {
      // Mock dailyGames document
      const mockDailyGameSnap = {
        exists: () => true,
        data: () => ({ movieId: 101 }),
      }

      // Mock movies document (Full details)
      const mockMovieSnap = {
        exists: () => true,
        data: () => mockCloudMovie,
      }

      // Configure the mock we captured in beforeEach
      getDocMock
        .mockResolvedValueOnce(mockDailyGameSnap)
        .mockResolvedValueOnce(mockMovieSnap)

      const result = await service.getDailyTriviaItemAndLists()

      // Check Daily Item (Cloud Data)
      expect(result.dailyItem.title).toBe("Movie A")
      expect(result.dailyItem.description).toBe("Full Cloud Plot")
      expect(result.dailyItem.hints[0].value).toBe("Director A")

      // Check Lists (Local Data)
      expect(result.basicItems).toHaveLength(2)
      expect(result.basicItems[0].title).toBe("Movie A")

      // Check Hydrated Full Items (Lite Data)
      expect(result.fullItems).toHaveLength(2)
      // Implicit feedback data should be present
      expect(result.fullItems[0].hints[0].value).toBe("Director A")
    })

    it("should throw an error if Firestore fails", async () => {
      getDocMock.mockRejectedValue(new Error("Network Error"))

      await expect(service.getDailyTriviaItemAndLists()).rejects.toThrow(
        "Could not load today's game",
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
      expect(item?.description).toBe("Full Cloud Plot")
    })

    it("should return null if doc does not exist", async () => {
      const mockSnap = { exists: () => false }
      getDocMock.mockResolvedValue(mockSnap)

      const item = await service.getItemById(999)
      expect(item).toBeNull()
    })
  })
})
