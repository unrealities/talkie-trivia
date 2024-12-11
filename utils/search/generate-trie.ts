import * as fs from "fs"

interface BasicMovie {
  id: number
  title: string
  release_date?: string // Optional
}

interface TrieNode {
  children: { [key: string]: TrieNode }
  isEndOfWord: boolean
  movieIds: number[]
}

const createTrieNode = (): TrieNode => ({
  children: {},
  isEndOfWord: false,
  movieIds: [],
})

const buildTrie = (movies: BasicMovie[]): TrieNode => {
  const root = createTrieNode()

  for (const movie of movies) {
    const title = movie.title.toLowerCase()
    let node = root
    for (let i = 0; i < title.length; i++) {
      const char = title[i]
      if (!node.children[char]) {
        node.children[char] = createTrieNode()
      }
      node = node.children[char]
      node.movieIds.push(movie.id)
    }
    node.isEndOfWord = true
  }

  return root
}

// Load movie data (make sure the path is correct)
const movies: BasicMovie[] = require("../../data/basicMovies.json")

const trie: TrieNode = buildTrie(movies)

fs.writeFileSync("trie.json", JSON.stringify(trie), "utf8")
console.log("Trie generated and saved to trie.json")
