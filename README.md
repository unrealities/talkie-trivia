# Talkie Trivia 🎬

Talkie Trivia is an engaging daily trivia game built with **React Native** and **Expo**. The goal is simple yet challenging: guess the movie based on a progressively revealing plot summary.

## ✨ Features

* **Daily Challenges:** A new movie to guess every day, synced via Cloud Schedule.
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

data/           # Local indexes (basicMovies.json, moviesLite.json)
src/
├── components/ # Reusable UI components
├── services/   # Hybrid Data Services (Firestore + Local Fallbacks)
├── state/      # Zustand global store
└── utils/      # Helper functions and hooks

## ⚙️ Data Pipeline (Go)

The `utils/` folder contains Go modules to fetch, optimize, and upload data.

1. **Generate Data:**
    Fetches raw data from TMDB and creates the source JSON.

    ```bash
    cd utils/data-pipeline && go run main.go
    ```

2. **Optimize Data (Local):**
    Creates `moviesLite.json` (for game logic) and `basicMovies.json` (for search) to keep the app bundle small.

    ```bash
    cd utils/optimize-data && go run main.go
    ```

3. **Populate Firestore (Cloud):**
    Uploads the *Full* movie details (Plots, Taglines) to Firestore.

    ```bash
    cd utils/populate-firestore && go run main.go
    ```

4. **Schedule Games:**
    Randomizes movies and assigns them to specific dates in the `dailyGames` collection.

    ```bash
    cd utils/schedule-games && go run main.go
    ```

## 🚀 Getting Started

1. **Install dependencies:** `npm install`
2. **Configure Environment:** Create a `.env` file with your Firebase credentials.
3. **Run the App:** `npm start`

## 📄 License

MIT License
