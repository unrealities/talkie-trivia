export class Game {
    answerID: number
    date: Date
    guessesMax: number
}

export class PlayerGame {
    correctAnswer: boolean
    endDate: Date
    guessesMade: number
    playerId: string
    startDate: Date
}
