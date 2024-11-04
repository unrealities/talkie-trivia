# talkie-trivia
React-Native app that uses TMDB data to make a name-that-movie trivia game.

## Data retrieval
TODO: Document how to fetch movie data and update days files.

Scripts exist in the `utils` directory. They are written in Go.

1. `fetchPopularMovies` gets all the most popular English language movies
2. `fetchMovies` uses fetchPopularMovies data to get all movie info for the most popular movies
3. `fetchMoviesCredits` get the actor and director data for each movie
4. `credits` creates actor and director data files
5. `basicMovies` creates a simple list of movies for selecting answers
6. `movies` generates a json of the data we may use for the application
