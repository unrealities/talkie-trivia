# Talkie Trivia 🎬

Talkie Trivia is an engaging daily trivia game built with **React Native** and **Expo**. The goal is simple yet challenging: guess the movie based on a progressively revealing plot summary.

## ✨ Features

* **Daily Challenges:** A new movie to guess every day, synced globally via Cloud Schedule.
* **Smart Search:** Instant, offline-ready fuzzy search using a local index.
* **Hybrid Data Architecture:**
  * **Fast:** Search logic runs instantly on-device (~2MB footprint).
  * **Rich:** Full movie details (high-res images, full plots) are fetched from the cloud only when needed.
* **Difficulty Levels:** From Basic (all hints revealed) to Extreme (no hints, fewer guesses).
* **Player Statistics:** Tracks streaks, win rates, and scores securely in Firestore.

## 🛠 Tech Stack

### Frontend

* **Framework:** React Native (Expo Managed Workflow)
* **Language:** TypeScript
* **State Management:** Zustand (w/ Immer)
* **Navigation:** Expo Router
* **Styling:** Custom hook-based theming system
* **Animations:** React Native Reanimated

### Backend & Data

* **Database:** Google Firestore
* **Auth:** Firebase Authentication
* **Data Pipeline:** Go (Golang) scripts for fetching and optimizing TMDB data.

## 📂 Project Structure

src/
├── components/ # Reusable UI components
├── data/       # Local indexes (basicMovies.json, moviesLite.json)
├── services/   # Hybrid Data Services (Firestore + Local Fallbacks)
├── state/      # Zustand global store
└── utils/      # Helper functions and hooks

## ⚙️ Data Pipeline (Go)

The `utils/` folder contains Go modules to fetch, optimize, and upload data.

**Prerequisites:**

1. `utils/secrets.json`: Contains `{"TMDBKey": "..."}`
2. `utils/serviceAccountKey.json`: Firebase Service Account Credentials.

**Execution Order (Reset Procedure):**

*Note: To target local emulators, export `FIRESTORE_EMULATOR_HOST="localhost:8080"` before running steps 3 & 4.*

1. **Generate Data (Fetch from TMDB):**
    Fetches raw data and creates the "Heavy" source file (not bundled) and the "Slim" search index (bundled).
    * *Input:* TMDB API
    * *Output:* `utils/data-source/popularMovies.json` & `src/data/basicMovies.json`

    ```bash
    cd utils/data-pipeline && go run main.go
    ```

2. **Optimize Data (Create App Logic File):**
    Strips unnecessary fields to create a lightweight logic file for the app bundle.
    * *Input:* `utils/data-source/popularMovies.json`
    * *Output:* `src/data/moviesLite.json`

    ```bash
    cd utils/optimize-data && go run main.go
    ```

3. **Populate Firestore (Upload Details):**
    Uploads the *Full* movie details (Plots, Taglines) to Firestore using standardized lowercase keys.
    * *Input:* `utils/data-source/popularMovies.json`
    * *Output:* Firestore `movies` collection

    ```bash
    cd utils/populate-firestore && go run main.go
    ```

4. **Schedule Games:**
    Randomizes movies and assigns them to specific dates in the `dailyGames` collection.
    * *Input:* Firestore `movies` IDs
    * *Output:* Firestore `dailyGames` collection

    ```bash
    cd utils/schedule-games && go run main.go
    ```

## 🚀 Getting Started

1. **Install dependencies:** `npm install`
2. **Configure Environment:** Create a `.env` file with your Firebase credentials.
3. **Run the App:** `npm start`

## 📄 License

MIT License
