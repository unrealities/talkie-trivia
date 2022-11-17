import Player from "./player"

export class Game {
    answerID: string
    date: Date
    guessesMax: number
    id: string
}

export class PlayerGame {
    correctAnswer: boolean
    endDate: Date
    guessesMade: number
    player: Player
    startDate: Date
}
