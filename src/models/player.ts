export default class Player {
  id: string
  name: string

  constructor(id: string, name: string) {
    if (!id) {
      throw new Error("Player ID is required.")
    }
    if (!name) {
      throw new Error("Player name is required.")
    }
    this.id = id
    this.name = name
  }
}
