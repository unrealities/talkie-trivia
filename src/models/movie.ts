export interface Actor {
  id: number
  imdb_id: string
  order: number
  name: string
  popularity: number
  profile_path: string
}

export interface BasicMovie {
  id: number
  release_date: string
  title: string
  poster_path: string
}

export interface Director {
  id: number
  name: string
  popularity: number
  profile_path: string
}

export interface Genre {
  id: number
  name: string
}

export interface Movie {
  actors: Actor[]
  director: Director
  genres: Genre[]
  id: number
  imdb_id: string
  overview: string
  poster_path: string
  popularity: number
  release_date: string
  tagline: string
  title: string
  vote_average: number
  vote_count: number
}
