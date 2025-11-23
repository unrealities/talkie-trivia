# Talkie Trivia 🎬

Talkie Trivia is an engaging daily trivia game built with **React Native** and **Expo**. The goal is simple yet challenging: guess the movie based on a progressively revealing plot summary.

Players can earn points, maintain streaks, use hints (like Director, Actors, and Genre), and compete on different difficulty levels. The app leverages a robust backend using **Firebase** for authentication and data storage, with a custom data pipeline written in **Go**.

## ✨ Features

* **Daily Challenges:** A new movie to guess every day, synced globally.
* **Progressive Clues:** Plot summaries are revealed word-by-word or chunk-by-chunk.
* **Multiple Difficulty Levels:**
  * **Basic:** All meta-hints (Cast, Year, etc.) are revealed at the start.
  * **Easy:** Use hint points to reveal specific meta-data.
  * **Medium (Default):** "Implicit Feedback" - incorrect guesses reveal matching categories (e.g., guessing a movie with the same director reveals the director).
  * **Hard:** No hints allowed.
  * **Extreme:** Fewer guesses allowed, slower reveals.
* **Smart Search:** Fuzzy search to easily find and select movie titles.
* **Player Statistics:** Tracks current streaks, max streaks, win distribution, and all-time scores.
* **Game History:** Review past games and results.
* **Authentication:** Anonymous login and Google Sign-In support to save progress across devices.
* **Theming:** Full support for Light, Dark, and System themes.
* **Animations:** Smooth UI transitions using `react-native-reanimated`.

## 🛠 Tech Stack

### Frontend

* **Framework:** React Native (Expo Managed Workflow)
* **Language:** TypeScript
* **State Management:** Zustand (w/ Immer)
* **Navigation:** Expo Router (File-based routing)
* **Styling:** Custom hook-based theming system (`useStyles`)
* **Animations:** React Native Reanimated
* **Lists:** Shopify FlashList

### Backend & Data

* **Database:** Google Firestore
* **Auth:** Firebase Authentication
* **Analytics:** Firebase Analytics
* **Data Pipeline:** Go (Golang) scripts for fetching/processing TMDB data
* **Scheduling:** Google Cloud Functions / Go scripts

### Testing

* **Unit/Integration:** Jest & React Native Testing Library

## 🚀 Getting Started

### Prerequisites

* Node.js (LTS)
* npm or yarn
* Expo CLI
* Go (optional, only for running data pipelines)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/unrealities/talkie-trivia.git
    cd talkie-trivia
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Environment Configuration:**

    Create a `.env` file in the root directory. You will need credentials for Firebase, TMDB, and Google OAuth.

    ```env
    # Firebase Config
    FIREBASE_APIKEY=your_api_key
    FIREBASE_APPID=your_app_id
    FIREBASE_MEASUREMENTID=your_measurement_id
    FIREBASE_MESSAGING_SENDERID=your_sender_id
    FIREBASE_PROJECTID=your_project_id

    # Google Auth Client IDs
    CLIENTID_EXPO=your_expo_client_id
    CLIENTID_IOS=your_ios_client_id
    CLIENTID_ANDROID=your_android_client_id
    CLIENTID_WEB=your_web_client_id

    # Data Source
    THEMOVIEDB_APIKEY=your_tmdb_api_key
    ```

4. **Run the App:**

    ```bash
    npm start
    ```

    Use the Expo Go app on your device or an emulator to scan the QR code.

## 🧪 Testing

The project maintains a high level of code coverage using Jest.

* **Run Tests:** `npm test`
* **Run with Coverage:** `npm run test:coverage`

## 📂 Project Structure

src/
├── app/ # Expo Router screens and layout
├── components/ # Reusable UI components
│ ├── game/ # Gameplay specific components (Board, Input)
│ ├── gameOver/ # Results screen components
│ └── ui/ # Generic atoms (Button, Card, Typography)
├── config/ # Constants, difficulty settings, Firebase init
├── contexts/ # React Contexts (Auth, Theme, Network)
├── data/ # Local JSON fallbacks (basicMovies.json)
├── models/ # TypeScript interfaces/types
├── services/ # API and Firebase service layers
├── state/ # Zustand global store
├── styles/ # Global theme tokens and utility styles
└── utils/ # Helper functions, hooks, and analytics

## ⚙️ Data Pipeline (Go)

The `utils/` folder contains Go modules used to populate and schedule the game data.

1. **Data Generation:**
    Navigate to `utils/data-pipeline` to fetch data from TMDB and process it into `popularMovies.json`.

    ```bash
    cd utils/data-pipeline
    go run main.go
    ```

2. **Populate Firestore:**
    Uploads the processed JSON to the `movies` collection.

    ```bash
    cd utils/populate-firestore
    go run main.go
    ```

3. **Schedule Games:**
    Randomizes movies and assigns them to specific dates in the `dailyGames` collection.

    ```bash
    cd utils/schedule-games
    go run main.go
    ```

*Note: You will need a `serviceAccountKey.json` in the `utils/` folder to allow the Go scripts to write to Firestore.*

## 🤝 Contributing

Contributions are welcome! Please read the code of conduct and follow the standard pull request process:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎬 Credits

* Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).
* Built with [Expo](https://expo.dev/).
