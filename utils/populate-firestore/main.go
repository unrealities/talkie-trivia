package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
)

// Match the structure of popularMovies.json
type Movie struct {
	Actors      interface{} `json:"actors"`
	Director    interface{} `json:"director"`
	Genres      interface{} `json:"genres"`
	ID          int         `json:"id"`
	ImdbID      string      `json:"imdb_id"`
	Overview    string      `json:"overview"`
	Popularity  float64     `json:"popularity"`
	PosterPath  string      `json:"poster_path"`
	ReleaseDate string      `json:"release_date"`
	Tagline     string      `json:"tagline"`
	Title       string      `json:"title"`
	VoteAverage float64     `json:"vote_average"`
	VoteCount   int         `json:"vote_count"`
}

const (
	serviceAccountKeyPath = "../serviceAccountKey.json"
	moviesJSONPath        = "../../src/data/popularMovies.json"
	projectID             = "talkie-trivia"
)

func main() {
	log.Println("Starting Firestore population script...")

	// 1. Set up Firestore client
	ctx := context.Background()
	sa := option.WithCredentialsFile(serviceAccountKeyPath)
	client, err := firestore.NewClient(ctx, projectID, sa)
	if err != nil {
		log.Fatalf("Failed to create Firestore client: %v", err)
	}
	defer client.Close()

	log.Printf("Successfully connected to Firestore project: %s", projectID)

	// 2. Read the movies JSON file
	absPath, _ := filepath.Abs(moviesJSONPath)
	jsonFile, err := os.Open(absPath)
	if err != nil {
		log.Fatalf("Failed to open movies JSON file at %s: %v", absPath, err)
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)
	var movies []Movie
	json.Unmarshal(byteValue, &movies)

	log.Printf("Read %d movies from %s", len(movies), moviesJSONPath)

	// 3. Upload movies to Firestore
	batch := client.Batch()
	moviesCollection := client.Collection("movies")
	commitCounter := 0

	for i, movie := range movies {
		// Use the movie's ID as the document ID for easy lookup
		docID := strconv.Itoa(movie.ID)
		docRef := moviesCollection.Doc(docID)
		batch.Set(docRef, movie)

		// Firestore batches are limited to 500 operations.
		// We commit every 400 to be safe.
		if (i+1)%400 == 0 || i == len(movies)-1 {
			log.Printf("Committing batch %d...", commitCounter+1)
			_, err := batch.Commit(ctx)
			if err != nil {
				log.Fatalf("Failed to commit batch: %v", err)
			}
			log.Printf("Successfully committed batch %d.", commitCounter+1)

			// Start a new batch
			batch = client.Batch()
			commitCounter++
			time.Sleep(1 * time.Second) // Be nice to the API
		}
	}

	log.Println("All movies have been successfully uploaded to Firestore!")
}
