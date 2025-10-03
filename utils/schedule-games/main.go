package main

import (
	"context"
	"log"
	"math/rand"
	"strconv"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

// Configuration Constants
const (
	serviceAccountKeyPath = "../serviceAccountKey.json"
	projectID             = "talkie-trivia"
	daysToSchedule        = 365 // Target: 1 year (6-12 months requested)
	batchSize             = 400 // Firestore transaction limit is 500
)

// DailyGame represents the structure of a document in the 'dailyGames' collection.
type DailyGame struct {
	MovieID int       `firestore:"movieId"`
	Date    time.Time `firestore:"date"`
}

func main() {
	log.Println("Starting daily games scheduling script...")

	// 1. Setup Firestore client with service account credentials
	ctx := context.Background()
	sa := option.WithCredentialsFile(serviceAccountKeyPath)
	client, err := firestore.NewClient(ctx, projectID, sa)
	if err != nil {
		log.Fatalf("Failed to create Firestore client: %v", err)
	}
	defer client.Close()

	log.Printf("Successfully connected to Firestore project: %s", projectID)

	// 2. Fetch all movie IDs from the 'movies' collection.
	log.Println("Fetching all movie IDs from Firestore...")
	moviesIter := client.Collection("movies").Select("id").Documents(ctx)
	var movieIDs []int
	for {
		doc, err := moviesIter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("Failed to iterate movie documents: %v", err)
		}
		// The ID is stored as a string in the document path, convert it back to int.
		movieID, _ := strconv.Atoi(doc.Ref.ID)
		if movieID > 0 {
			movieIDs = append(movieIDs, movieID)
		}
	}
	if len(movieIDs) == 0 {
		log.Fatal("No movies found in 'movies' collection. Run the data pipeline script first.")
	}
	log.Printf("Found %d unique movie IDs for scheduling.", len(movieIDs))

	// 3. Determine the starting date for new schedules.
	now := time.Now()
	// Normalize 'today' to midnight for consistent date calculations
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	startDate := today

	// Find the date of the last scheduled game
	lastGameQuery := client.Collection("dailyGames").OrderBy("date", firestore.Desc).Limit(1)
	docs, err := lastGameQuery.Documents(ctx).GetAll()

	if err == nil && len(docs) > 0 {
		lastGameData := docs[0].Data()
		if lastGameTimestamp, ok := lastGameData["date"].(time.Time); ok {
			// Start the new schedule one day after the latest existing schedule
			lastScheduledDate := time.Date(lastGameTimestamp.Year(), lastGameTimestamp.Month(), lastGameTimestamp.Day(), 0, 0, 0, 0, lastGameTimestamp.Location())

			if lastScheduledDate.After(today) || lastScheduledDate.Equal(today) {
				startDate = lastScheduledDate.AddDate(0, 0, 1)
			}
			log.Printf("Last scheduled game found on: %s. New scheduling starts from: %s", lastScheduledDate.Format("2006-01-02"), startDate.Format("2006-01-02"))
		}
	} else if err != nil {
		log.Printf("Warning: Could not query for last game date (%v). Scheduling starts from today: %s", err, startDate.Format("2006-01-02"))
	} else {
		log.Printf("No existing daily games found. Scheduling starts from today: %s", startDate.Format("2006-01-02"))
	}

	// 4. Shuffle the movie IDs to ensure non-repeating random selection over the schedule window.
	// We use the full Nano timestamp as a seed for non-deterministic randomization across runs.
	source := rand.NewSource(time.Now().UnixNano())
	r := rand.New(source)
	r.Shuffle(len(movieIDs), func(i, j int) {
		movieIDs[i], movieIDs[j] = movieIDs[j], movieIDs[i]
	})

	// 5. Create and commit batches of new daily games.
	log.Printf("Scheduling games for the next %d days...", daysToSchedule)

	batch := client.Batch()
	dailyGamesCollection := client.Collection("dailyGames")
	movieIndex := 0

	for i := 0; i < daysToSchedule; i++ {
		gameDate := startDate.AddDate(0, 0, i)
		dateID := gameDate.Format("2006-01-02")

		// Cycle through the shuffled movie IDs
		if movieIndex >= len(movieIDs) {
			// Reshuffle for the next cycle to avoid predictable sequences
			r.Shuffle(len(movieIDs), func(i, j int) {
				movieIDs[i], movieIDs[j] = movieIDs[j], movieIDs[i]
			})
			movieIndex = 0
		}

		selectedMovieID := movieIDs[movieIndex]
		movieIndex++

		docRef := dailyGamesCollection.Doc(dateID)

		gameData := DailyGame{
			MovieID: selectedMovieID,
			Date:    gameDate,
		}

		// The document data structure is now type-safe via the struct.
		batch.Set(docRef, gameData)

		// Commit batch periodically to stay within transaction limits.
		if (i+1)%batchSize == 0 || i == daysToSchedule-1 {
			commitCount := i + 1
			log.Printf("Committing batch %d: scheduling up to %s...", commitCount/batchSize+1, dateID)

			_, err := batch.Commit(ctx)
			if err != nil {
				log.Fatalf("Batch commit failed for date %s: %v", dateID, err)
			}

			// Start a new batch after successful commit, unless done
			if i < daysToSchedule-1 {
				batch = client.Batch()
			}
		}
	}

	log.Println("All daily games have been successfully scheduled!")
}
