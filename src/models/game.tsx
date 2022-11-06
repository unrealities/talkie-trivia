interface Game {
    answerID: number
    date: Date
    guessesMax: number
}

interface PlayerGame {
    correctAnswer: boolean
    endDate: Date
    guessesMade: number
    playerId: string
    startDate: Date
}
