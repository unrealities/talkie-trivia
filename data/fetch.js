import 'dotenv/config'

let movieID = 5
const movieURL = new URL('https://example.com')
movieURL.protocol = 'https'
movieURL.hostname = 'api.themoviedb.org'
movieURL.pathname = `/3/movie/${movieID}`
movieURL.search = `api_key=${process.env.THEMOVIEDB_APIKEY}`
movieURL
