import { Movie } from './movie'
import Player from './player'

export class Game {
    date: Date
    guessesMax: number
    id: string
    movie: Movie
}

export class PlayerGame {
    correctAnswer: boolean
    endDate: Date
    game: Game
    guesses: number[]
    id: string
    player: Player
    startDate: Date
}
