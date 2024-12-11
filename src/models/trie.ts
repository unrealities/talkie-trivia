export interface TrieNode {
  children: { [key: string]: TrieNode }
  isEndOfWord: boolean
  movieIds: number[]
}
