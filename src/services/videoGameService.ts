import { IGameDataService } from "./iGameDataService"
import { GameMode, TriviaItem, BasicTriviaItem } from "../models/trivia"

export class VideoGameService implements IGameDataService {
  public mode: GameMode = "videoGames"

  public async getDailyTriviaItemAndLists(): Promise<{
    dailyItem: TriviaItem
    fullItems: readonly TriviaItem[]
    basicItems: readonly BasicTriviaItem[]
  }> {
    // In the future, this will load from a videoGames.json file
    // For now, it's a placeholder.
    console.warn("VideoGameService is not yet implemented.")
    throw new Error("Video game mode is not available yet.")

    // Example of what it would return:
    // return {
    //   dailyItem: {} as TriviaItem,
    //   fullItems: [],
    //   basicItems: [],
    // };
  }

  public async getItemById(id: number | string): Promise<TriviaItem | null> {
    throw new Error("VideoGameService.getItemById is not yet implemented.")
  }
}
