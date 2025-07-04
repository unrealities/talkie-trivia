# Talkie Trivia

A React Native mobile game that challenges you to name the movie from its plot summary, powered by data from The Movie Database (TMDB) and Firebase.

## Data Retrieval and Backend Setup

The game relies on a curated list of movies stored in Firebase Firestore. A daily Cloud Function selects a new movie for players. The following steps detail how to fetch movie data from TMDB, process it, and populate your Firebase backend.

The data processing scripts are located in the `utils/` directory and are written in Go.

### Prerequisites

Before you begin, ensure you have the following installed and configured:

1. **Go:** [Installation Guide](https://golang.org/doc/install)
2. **Node.js & npm:** Required for Firebase Functions.
3. **Firebase CLI:** Run `npm install -g firebase-tools` to install. Log in with `firebase login`.
4. **TMDB API Key:** Get a free API key from [themoviedb.org](https://www.themoviedb.org/documentation/api).
5. **Firebase Project:** A Firebase project with Firestore and Cloud Functions enabled.

### Step 1: Configuration

You need to provide credentials for both the TMDB API and the Firebase Admin SDK. These files are listed in `.gitignore` and **should never be committed to version control.**

1. **TMDB API Key:**
    *  In the `utils/` directory, create a file named `secrets.json` based on `secrets.example.json`.
    *  Add your TMDB API key to it:
        ```json
        // utils/secrets.json
        {
            "TMDBKey": "YOUR_TMDB_API_KEY_HERE"
        }
        ```

2. **Firebase Admin Credentials:**
    * In your Firebase Console, navigate to **Project Settings > Service accounts**.
    * Click **"Generate new private key"** and save the downloaded JSON file.
    * Move this file to `utils/serviceAccountKey.json`. The Go scripts are configured to look for it there.

### Step 2: Running the Data Processing Scripts

Run these scripts sequentially from the root of the repository. Each script builds upon the output of the previous one.

1. **Fetch Popular Movies**
    This script queries the TMDB API for the top 500 pages of popular English-language movies and saves their raw data.

    ```bash
    cd utils/fetchPopularMovies && go run .
    ```
    *  **Output:** Creates `utils/fetchPopularMovies/popular_movies_raw.json`.

2. **Fetch Detailed Movie Info**
    This script reads the raw popular movies file and fetches detailed information for each one.

    ```bash
    cd ../fetchMovies && go run .
    ```
    *   **Output:** Creates `utils/fetchMovies/movies.txt`, which is then processed into `data/movies.json`.

3. **Fetch Movie Credits**
    This script fetches the cast and crew (specifically directors) for every movie in `data/movies.json`.

    ```bash
    cd ../fetchMoviesCredits && go run .
    ```
    *   **Output:** Creates `utils/fetchMoviesCredits/credits.txt`, which is processed into `data/credits.json`.

4. **Process Credits Data**
    This script aggregates the raw credits data into structured files for actors and directors.

    ```bash
    cd ../credits && go run .
    ```
    *   **Output:** Creates `data/movieActors.json` and `data/movieDirectors.json`.

5. **Generate Client-Side Search List**
    This script creates a lightweight JSON file containing only the ID, title, and release year for movies. This is bundled with the app to power the search picker.

    ```bash
    cd ../basicMovies && go run .
    ```
    *   **Output:** Creates `data/basicMovies.json`.
