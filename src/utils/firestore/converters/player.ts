import Player from "../../../models/player"
import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore"

export const playerConverter = {
  toFirestore: (player: Player) => {
    let p: Player = {
      id: player.id,
      name: player.name,
    }
    return p
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Player => {
    const data = snapshot.data(options)
    let p: Player = {
      id: data.id,
      name: data.name,
    }
    return p
  },
}
