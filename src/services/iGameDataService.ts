import { BasicTriviaItem, TriviaItem, GameMode } from "../models/trivia"

export interface IGameDataService {
  mode: GameMode

  /**
   * Fetches the daily trivia item and the full lists of basic/full items for the game.
   */
  getDailyTriviaItemAndLists(): Promise<{
    dailyItem: TriviaItem
    fullItems: readonly TriviaItem[]
    basicItems: readonly BasicTriviaItem[]
  }>

  /**
   * Fetches a single trivia item by its ID.
   * @param id The ID of the item to fetch.
   */
  getItemById(id: number | string): Promise<TriviaItem | null>
}
