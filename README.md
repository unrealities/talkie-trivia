# Talkie Trivia

A React Native mobile game that challenges you to name the movie from its plot summary, powered by data from The Movie Database (TMDB) and Firebase.

## Data Retrieval and Backend Setup

The game relies on a curated list of movies stored in Firebase Firestore. A daily Cloud Function selects a new movie for players. The following steps detail how to fetch movie data from TMDB, process it, and generate the necessary JSON files for your Firebase backend and application client.

The data processing scripts are located in the `utils/` directory and are written in Go.

### Prerequisites

Before you begin, ensure you have the following installed and configured:

1. **Go:** [Installation Guide](https://golang.org/doc/install)
2. **Node.js & npm:** Required for Firebase Functions.
3. **Firebase CLI:** Run `npm install -g firebase-tools` to install. Log in with `firebase login`.
4. **TMDB API Key:** Get a free API key from [themoviedb.org](https://www.themoviedb.org/documentation/api).
5. **Firebase Project:** A Firebase project with Firestore and Cloud Functions enabled.

### Configuration

You need to provide credentials for the TMDB API. This file is listed in `.gitignore` and **should never be committed to version control.**

1. **TMDB API Key:**
    * In the `utils/` directory, create a file named `secrets.json` based on `secrets.example.json`.
    * Add your TMDB API key to it:

        ```json
        // utils/secrets.json
        {
            "TMDBKey": "YOUR_TMDB_API_KEY_HERE"
        }
        ```

2. **Firebase Admin Credentials (For Uploading):**
    * To upload the generated data to Firestore or run the Cloud Functions, you will need Firebase Admin credentials.
    * In your Firebase Console, navigate to **Project Settings > Service accounts**.
    * Click **"Generate new private key"** and save the downloaded JSON file.
    * The Cloud Functions are configured to use these credentials automatically when deployed. For local upload scripts, you might place this file at the root of your functions directory.
    * **Note:** The Go data-generation scripts below do *not* require this key, as they only create local files.

---

### Alternate (Recommended) Process: Unified Data Generation Script

#### Step 1: Run the Unified Script

Run the script from the new directory. It will handle fetching popular movie IDs, their details, and their credits, then process and filter everything before writing the final files.

```bash
cd utils/generateAllData && go run .
```

The script will log its progress as it fetches pages and processes movies.

#### Step 2: Review the Output

This single command performs all necessary API calls and generates the final data files directly in the correct location.

* **Output Location:** `src/data/`

* **Generated Files:**
 * `popularMovies.json`: A complete list of movie objects, including details, genres, actors, and directors. This file is ready to be uploaded to Firestore and replaces the need for the old `movies.json`, `movieActors.json`, and `movieDirectors.json`.
 * `basicMovies.json`: A lightweight list containing only movie ID, title, and release year. This is bundled with the mobile app to power the search picker.

After running this script, you can proceed with uploading `popularMovies.json` to your Firebase Firestore database.

---

### Original Multi-Step Process (Legacy)

The following is the original, multi-step process for generating the data. It is recommended to use the new, unified script above.

Run these scripts sequentially from the root of the repository. Each script builds upon the output of the previous one.

1. **Fetch Popular Movies**
    This script queries the TMDB API for the top 500 pages of popular English-language movies and saves their raw data.

    ```bash
    cd utils/fetchPopularMovies && go run .
    ```

    * **Output:** Creates `utils/fetchPopularMovies/popular_movies_raw.json`.

2. **Fetch Detailed Movie Info**
    This script reads the raw popular movies file and fetches detailed information for each one.

    ```bash
    cd ../fetchMovies && go run .
    ```

    * **Output:** Creates `utils/fetchMovies/movies.txt`, which is then processed into `data/movies.json`.

3. **Fetch Movie Credits**
    This script fetches the cast and crew (specifically directors) for every movie in `data/movies.json`.

    ```bash
    cd ../fetchMoviesCredits && go run .
    ```

    * **Output:** Creates `utils/fetchMoviesCredits/credits.txt`, which is processed into `data/credits.json`.

4. **Process Credits Data**
    This script aggregates the raw credits data into structured files for actors and directors.

    ```bash
    cd ../credits && go run .
    ```

    * **Output:** Creates `data/movieActors.json` and `data/movieDirectors.json`.

5. **Generate Client-Side Search List**
    This script creates a lightweight JSON file containing only the ID, title, and release year for movies. This is bundled with the app to power the search picker.

    ```bash
    cd ../basicMovies && go run .
    ```

    * **Output:** Creates `data/basicMovies.json`.
