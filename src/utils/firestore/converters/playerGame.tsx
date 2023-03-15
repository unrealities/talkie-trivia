import { PlayerGame } from '../../../models/game'

export const playerGameConverter = {
    toFirestore: (playerGame) => {
        let pg: PlayerGame = {
            correctAnswer: playerGame.correctAnswer,
            endDate: playerGame.endDate,
            game: playerGame.game,
            guesses: playerGame.guesses,
            id: playerGame.id,
            playerID: playerGame.playerID,
            startDate: playerGame.startDate
        }
        return pg
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        let pg: PlayerGame = {
            correctAnswer: data.correctAnswer,
            endDate: data.endDate,
            game: data.game,
            guesses: data.guesses,
            id: data.id,
            playerID: data.playerID,
            startDate: data.startDate
        }
        return pg
    }
}
