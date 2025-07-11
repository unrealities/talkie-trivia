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

const (
	serviceAccountKeyPath = "../serviceAccountKey.json"
	projectID             = "talkie-trivia"
	daysToSchedule        = 180
)

func main() {
	log.Println("Starting daily games scheduling script...")

	ctx := context.Background()
	sa := option.WithCredentialsFile(serviceAccountKeyPath)
	client, err := firestore.NewClient(ctx, projectID, sa)
	if err != nil {
		log.Fatalf("Failed to create Firestore client: %v", err)
	}
	defer client.Close()

	// 1. Fetch all movie IDs from the 'movies' collection.
	log.Println("Fetching all movie IDs from Firestore...")
	moviesIter := client.Collection("movies").Select().Documents(ctx)
	var movieIDs []string
	for {
		doc, err := moviesIter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("Failed to iterate movie documents: %v", err)
		}
		movieIDs = append(movieIDs, doc.Ref.ID)
	}
	if len(movieIDs) == 0 {
		log.Fatal("No movies found in 'movies' collection. Run the populate script first.")
	}
	log.Printf("Found %d movies.", len(movieIDs))

	// 2. Determine the correct start date for scheduling.
	log.Println("Determining the correct start date for scheduling...")

	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	startDate := today

	lastGameQuery := client.Collection("dailyGames").OrderBy("date", firestore.Desc).Limit(1)
	docs, err := lastGameQuery.Documents(ctx).GetAll()

	if err != nil {
		log.Printf("Warning: Could not query for last game date: %v. Assuming no games are scheduled.", err)
	} else if len(docs) > 0 {
		lastGameData := docs[0].Data()
		if lastGameTimestamp, ok := lastGameData["date"].(time.Time); ok {
			// Normalize the last scheduled date to midnight for a fair comparison with `today`.
			lastScheduledDate := time.Date(lastGameTimestamp.Year(), lastGameTimestamp.Month(), lastGameTimestamp.Day(), 0, 0, 0, 0, lastGameTimestamp.Location())
			log.Printf("Last scheduled game in DB is on: %s", lastScheduledDate.Format("2006-01-02"))

			if !lastScheduledDate.Before(today) {
				startDate = lastScheduledDate.AddDate(0, 0, 1)
			}
		}
	}
	log.Printf("Scheduling will begin from: %s", startDate.Format("2006-01-02"))

	// 3. Shuffle the movie IDs for random assignment.
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(movieIDs), func(i, j int) {
		movieIDs[i], movieIDs[j] = movieIDs[j], movieIDs[i]
	})

	// 4. Create and commit batches of new daily games.
	log.Printf("Scheduling games for the next %d days...", daysToSchedule)
	batch := client.Batch()
	movieIndex := 0
	dailyGamesCollection := client.Collection("dailyGames")

	for i := 0; i < daysToSchedule; i++ {
		gameDate := startDate.AddDate(0, 0, i)
		dateID := gameDate.Format("2006-01-02")

		if movieIndex >= len(movieIDs) {
			movieIndex = 0
		}
		selectedMovieID, _ := strconv.Atoi(movieIDs[movieIndex])

		docRef := dailyGamesCollection.Doc(dateID)
		batch.Set(docRef, map[string]interface{}{
			"movieId": selectedMovieID,
			"date":    gameDate,
		})
		movieIndex++

		if (i+1)%400 == 0 || i == daysToSchedule-1 {
			commitCount := i + 1
			log.Printf("Committing batch of games up to %s (%d/%d)...", dateID, commitCount, daysToSchedule)
			_, err := batch.Commit(ctx)
			if err != nil {
				log.Fatalf("Batch commit failed: %v", err)
			}
			batch = client.Batch()
		}
	}

	log.Println("Successfully scheduled all new daily games!")
}
