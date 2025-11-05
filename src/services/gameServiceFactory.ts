import { GameMode } from "../models/trivia"
import { IGameDataService } from "./iGameDataService"
import { MovieDataService } from "./movieDataService"
import { VideoGameService } from "./videoGameService"

// A map holding a single instance of each service
const serviceInstances: { [key in GameMode]?: IGameDataService } = {
  movies: new MovieDataService(),
  videoGames: new VideoGameService(),
  // tvShows: new TvShowDataService(),
}

export function getGameDataService(mode: GameMode): IGameDataService {
  const service = serviceInstances[mode]
  if (!service) {
    throw new Error(`No game data service found for mode: ${mode}`)
  }
  return service
}
