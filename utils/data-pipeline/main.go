package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

const (
	tmdbBaseURL     = "https://api.themoviedb.org/3"
	pagesToFetch    = 500
	outputDir       = "../../src/data"
	secretsFilePath = "../secrets.json"
)

type TMDBDiscoverResponse struct {
	Results []struct {
		ID int `json:"id"`
	} `json:"results"`
}

type TMDBDetailsResponse struct {
	ID          int     `json:"id"`
	ImdbID      string  `json:"imdb_id"`
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	Tagline     string  `json:"tagline"`
	PosterPath  string  `json:"poster_path"`
	ReleaseDate string  `json:"release_date"`
	Popularity  float64 `json:"popularity"`
	VoteAverage float64 `json:"vote_average"`
	VoteCount   int     `json:"vote_count"`
	Runtime     int     `json:"runtime"`
	Genres      []Genre `json:"genres"`
}

type TMDBCreditsResponse struct {
	Cast []struct {
		ID          int     `json:"id"`
		Name        string  `json:"name"`
		Popularity  float64 `json:"popularity"`
		ProfilePath string  `json:"profile_path"`
		Order       int     `json:"order"`
	} `json:"cast"`
	Crew []struct {
		ID          int     `json:"id"`
		Name        string  `json:"name"`
		Popularity  float64 `json:"popularity"`
		ProfilePath string  `json:"profile_path"`
		Job         string  `json:"job"`
	} `json:"crew"`
}

// This is the final struct we will write to our JSON and Firestore
type Movie struct {
	Actors           []MovieActor  `json:"actors"`
	Director         MovieDirector `json:"director"`
	Genres           []Genre       `json:"genres"`
	ID               int           `json:"id"`
	ImdbID           string        `json:"imdb_id"`
	OriginalOverview string        `json:"original_overview"`
	Overview         string        `json:"overview"`
	Popularity       float64       `json:"popularity"`
	PosterPath       string        `json:"poster_path"`
	ReleaseDate      string        `json:"release_date"`
	Tagline          string        `json:"tagline"`
	Title            string        `json:"title"`
	VoteAverage      float64       `json:"vote_average"`
	VoteCount        int           `json:"vote_count"`
}

type BasicMovie struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	ReleaseDate string `json:"release_date"`
	PosterPath  string `json:"poster_path"`
}

type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type MovieActor struct {
	ID          int     `json:"id"`
	Order       int     `json:"order"`
	Name        string  `json:"name"`
	Popularity  float64 `json:"popularity"`
	ProfilePath string  `json:"profile_path"`
}

type MovieDirector struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Popularity  float64 `json:"popularity"`
	ProfilePath string  `json:"profile_path"`
}

// List of common words to ignore in titles when looking for sensitive keywords
var stopWords = map[string]bool{
	"the": true, "a": true, "an": true, "of": true, "in": true, "and": true, "or": true,
	"&": true, "to": true, "is": true, "on": true, "for": true, "with": true, "s": true,
	"from": true, "by": true, "at": true, "part": true, "i": true, "ii": true, "iii": true,
}

// sanitizeOverview intelligently removes keywords from the movie title from its overview.
func sanitizeOverview(title, overview string) string {
	// 1. Extract significant words from the title
	re := regexp.MustCompile(`[a-zA-Z0-9']+`)
	titleWords := re.FindAllString(strings.ToLower(title), -1)

	var sensitiveWords []string
	for _, word := range titleWords {
		if !stopWords[word] && len(word) > 2 {
			sensitiveWords = append(sensitiveWords, word)
		}
	}

	if len(sensitiveWords) == 0 {
		return overview
	}

	sanitizedOverview := overview

	// 3. Handle general cases for all other sensitive words
	placeholder := "[the protagonist]"
	if len(sensitiveWords) > 1 {
		placeholder = "[a key figure]"
	}

	for _, word := range sensitiveWords {
		// Use a case-insensitive, whole-word regex for replacement
		regexToReplace := regexp.MustCompile(`(?i)\b` + regexp.QuoteMeta(word) + `\b`)
		sanitizedOverview = regexToReplace.ReplaceAllString(sanitizedOverview, placeholder)
	}

	return sanitizedOverview
}

func getTMDBKey() (string, error) {
	type Config struct {
		TMDBKey string `json:"TMDBKey"`
	}
	configFile, err := os.Open(secretsFilePath)
	if err != nil {
		return "", fmt.Errorf("could not open secrets file at %s: %w", secretsFilePath, err)
	}
	defer configFile.Close()

	secretsBytes, err := io.ReadAll(configFile)
	if err != nil {
		return "", fmt.Errorf("could not read secrets file: %w", err)
	}

	var config Config
	if err := json.Unmarshal(secretsBytes, &config); err != nil {
		return "", fmt.Errorf("could not parse secrets file: %w", err)
	}

	if config.TMDBKey == "" {
		return "", fmt.Errorf("TMDBKey is missing from secrets.json")
	}
	return config.TMDBKey, nil
}

func fetchFromAPI(client *http.Client, endpoint string, apiKey string, params map[string]string) ([]byte, error) {
	baseURL, err := url.Parse(tmdbBaseURL + endpoint)
	if err != nil {
		return nil, err
	}

	q := baseURL.Query()
	q.Set("api_key", apiKey)
	for key, val := range params {
		q.Set(key, val)
	}
	baseURL.RawQuery = q.Encode()

	resp, err := client.Get(baseURL.String())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %s", resp.Status)
	}

	return io.ReadAll(resp.Body)
}

func writeJSONFile(filePath string, data interface{}) error {
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	return encoder.Encode(data)
}

func main() {
	log.Println("Starting data generation pipeline...")

	apiKey, err := getTMDBKey()
	if err != nil {
		log.Fatalf("Error getting API key: %v", err)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	var finalMovies []Movie
	var finalBasicMovies []BasicMovie

	log.Println("Fetching movie IDs from TMDB discover endpoint...")
	for page := 1; page <= pagesToFetch; page++ {
		log.Printf("Fetching page %d of %d...", page, pagesToFetch)
		discoverParams := map[string]string{
			"page":             strconv.Itoa(page),
			"include_adult":    "false",
			"include_video":    "false",
			"language":         "en-US",
			"sort_by":          "popularity.desc",
			"with_runtime.gte": "75",
			"vote_count.gte":   "400",
		}

		body, err := fetchFromAPI(client, "/discover/movie", apiKey, discoverParams)
		if err != nil {
			log.Printf("Warning: Failed to fetch page %d: %v", page, err)
			continue
		}

		var discoverResp TMDBDiscoverResponse
		if err := json.Unmarshal(body, &discoverResp); err != nil {
			log.Printf("Warning: Failed to parse discover response for page %d: %v", page, err)
			continue
		}

		for _, movieStub := range discoverResp.Results {
			movieID := movieStub.ID
			log.Printf("Processing movie ID: %d", movieID)

			detailsBody, err := fetchFromAPI(client, fmt.Sprintf("/movie/%d", movieID), apiKey, nil)
			if err != nil {
				log.Printf("Warning: Failed to fetch details for movie %d: %v", movieID, err)
				continue
			}
			var details TMDBDetailsResponse
			json.Unmarshal(detailsBody, &details)

			creditsBody, err := fetchFromAPI(client, fmt.Sprintf("/movie/%d/credits", movieID), apiKey, nil)
			if err != nil {
				log.Printf("Warning: Failed to fetch credits for movie %d: %v", movieID, err)
				continue
			}
			var credits TMDBCreditsResponse
			json.Unmarshal(creditsBody, &credits)

			if len(details.Overview) >= 400 || len(details.Overview) <= 60 ||
				details.Runtime <= 75 || details.Popularity <= 10 || details.VoteAverage <= 4.9 || details.VoteCount <= 400 {
				continue
			}

			sanitizedOverview := sanitizeOverview(details.Title, details.Overview)

			var director MovieDirector
			for _, crew := range credits.Crew {
				if crew.Job == "Director" {
					director = MovieDirector{
						ID:          crew.ID,
						Name:        crew.Name,
						Popularity:  crew.Popularity,
						ProfilePath: crew.ProfilePath,
					}
					break
				}
			}

			var actors []MovieActor
			for _, cast := range credits.Cast {
				actors = append(actors, MovieActor{
					ID:          cast.ID,
					Order:       cast.Order,
					Name:        cast.Name,
					Popularity:  cast.Popularity,
					ProfilePath: cast.ProfilePath,
				})
			}

			movie := Movie{
				Actors:           actors,
				Director:         director,
				Genres:           details.Genres,
				ID:               details.ID,
				ImdbID:           details.ImdbID,
				OriginalOverview: details.Overview,
				Overview:         sanitizedOverview,
				Popularity:       details.Popularity,
				PosterPath:       details.PosterPath,
				ReleaseDate:      details.ReleaseDate,
				Tagline:          details.Tagline,
				Title:            details.Title,
				VoteAverage:      details.VoteAverage,
				VoteCount:        details.VoteCount,
			}
			finalMovies = append(finalMovies, movie)

			basicMovie := BasicMovie{
				ID:          details.ID,
				Title:       details.Title,
				ReleaseDate: details.ReleaseDate,
				PosterPath:  details.PosterPath,
			}
			finalBasicMovies = append(finalBasicMovies, basicMovie)

			time.Sleep(100 * time.Millisecond)
		}
	}

	log.Printf("Fetched and processed %d valid movies.", len(finalMovies))

	log.Println("De-duplicating and sorting basic movies list...")
	titleCounts := make(map[string]int)
	for _, m := range finalBasicMovies {
		titleCounts[m.Title]++
	}

	for i, m := range finalBasicMovies {
		if titleCounts[m.Title] > 1 {
			year := strings.Split(m.ReleaseDate, "-")[0]
			finalBasicMovies[i].Title = fmt.Sprintf("%s (%s)", m.Title, year)
		}
	}

	sort.Slice(finalBasicMovies, func(i, j int) bool {
		return finalBasicMovies[i].Title < finalBasicMovies[j].Title
	})

	log.Printf("Writing output files to %s...", outputDir)
	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
		log.Fatalf("Failed to create output directory: %v", err)
	}

	popularMoviesPath := filepath.Join(outputDir, "popularMovies.json")
	if err := writeJSONFile(popularMoviesPath, finalMovies); err != nil {
		log.Fatalf("Failed to write popularMovies.json: %v", err)
	}
	log.Printf("Successfully wrote %s", popularMoviesPath)

	basicMoviesPath := filepath.Join(outputDir, "basicMovies.json")
	if err := writeJSONFile(basicMoviesPath, finalBasicMovies); err != nil {
		log.Fatalf("Failed to write basicMovies.json: %v", err)
	}
	log.Printf("Successfully wrote %s", basicMoviesPath)

	log.Println("Pipeline completed successfully!")
}
