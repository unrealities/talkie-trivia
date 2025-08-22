import Player from "../../../models/player"

export const playerConverter = {
  toFirestore: (player) => {
    let p: Player = {
      id: player.id,
      name: player.name,
    }
    return p
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    let p: Player = {
      id: data.id,
      name: data.name,
    }
    return p
  },
}
