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

type Movie struct {
	Actors           interface{} `json:"actors" firestore:"actors"`
	Director         interface{} `json:"director" firestore:"director"`
	Genres           interface{} `json:"genres" firestore:"genres"`
	ID               int         `json:"id" firestore:"id"`
	ImdbID           string      `json:"imdb_id" firestore:"imdb_id"`
	OriginalOverview string      `json:"original_overview" firestore:"original_overview"`
	Overview         string      `json:"overview" firestore:"overview"`
	ManualOverview   string      `json:"manual_overview,omitempty" firestore:"manual_overview,omitempty"`
	Popularity       float64     `json:"popularity" firestore:"popularity"`
	PosterPath       string      `json:"poster_path" firestore:"poster_path"`
	ReleaseDate      string      `json:"release_date" firestore:"release_date"`
	Tagline          string      `json:"tagline" firestore:"tagline"`
	Title            string      `json:"title" firestore:"title"`
	VoteAverage      float64     `json:"vote_average" firestore:"vote_average"`
	VoteCount        int         `json:"vote_count" firestore:"vote_count"`
}

const (
	serviceAccountKeyPath = "../serviceAccountKey.json"
	moviesJSONPath        = "../../data/popularMovies.json"
	projectID             = "talkie-trivia-app"
)

func main() {
	log.Println("Starting Firestore population script...")

	ctx := context.Background()
	sa := option.WithCredentialsFile(serviceAccountKeyPath)
	client, err := firestore.NewClient(ctx, projectID, sa)
	if err != nil {
		log.Fatalf("Failed to create Firestore client: %v", err)
	}
	defer client.Close()

	log.Printf("Successfully connected to Firestore project: %s", projectID)

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

	batch := client.Batch()
	moviesCollection := client.Collection("movies")
	commitCounter := 0

	for i, movie := range movies {
		docID := strconv.Itoa(movie.ID)
		docRef := moviesCollection.Doc(docID)
		batch.Set(docRef, movie)

		if (i+1)%400 == 0 || i == len(movies)-1 {
			log.Printf("Committing batch %d...", commitCounter+1)
			_, err := batch.Commit(ctx)
			if err != nil {
				log.Fatalf("Failed to commit batch: %v", err)
			}
			log.Printf("Successfully committed batch %d.", commitCounter+1)
			batch = client.Batch()
			commitCounter++
			time.Sleep(500 * time.Millisecond)
		}
	}

	log.Println("Database successfully normalized to lowercase keys!")
}
