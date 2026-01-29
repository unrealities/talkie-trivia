package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
)

// Input format (Full Data)
type SourceMovie struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	ReleaseDate string `json:"release_date"`
	Genres      []struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	} `json:"genres"`
	Director struct {
		Name string `json:"name"`
	} `json:"director"`
	Actors []struct {
		Name string `json:"name"`
	} `json:"actors"`
}

// Output format (Lite Data - Minimized keys to save space)
type LiteMovie struct {
	ID int `json:"id"`
	// We map the structure to simple arrays/strings to save space
	// "d" = Director, "g" = Genres, "c" = Cast/Actors, "y" = Year
	Director string   `json:"d"`
	Genres   []string `json:"g"`
	Cast     []string `json:"c"`
	Year     string   `json:"y"`
}

func main() {
	inputFile := "../../data/popularMovies.json"
	outputFile := "../../data/moviesLite.json"

	log.Println("Reading source file...")
	byteValue, err := ioutil.ReadFile(inputFile)
	if err != nil {
		log.Fatal(err)
	}

	var sourceMovies []SourceMovie
	json.Unmarshal(byteValue, &sourceMovies)

	var liteMovies []LiteMovie

	for _, m := range sourceMovies {
		// Flatten Genres
		var genres []string
		for _, g := range m.Genres {
			genres = append(genres, g.Name)
		}

		// Flatten Cast (Top 3 only is usually enough for hints, lets keep 5 to be safe)
		var cast []string
		limit := 5
		if len(m.Actors) < limit {
			limit = len(m.Actors)
		}
		for i := 0; i < limit; i++ {
			cast = append(cast, m.Actors[i].Name)
		}

		// Extract Year
		year := ""
		if len(m.ReleaseDate) >= 4 {
			year = m.ReleaseDate[:4]
		}

		liteMovies = append(liteMovies, LiteMovie{
			ID:       m.ID,
			Director: m.Director.Name,
			Genres:   genres,
			Cast:     cast,
			Year:     year,
		})
	}

	log.Printf("Optimized %d movies.", len(liteMovies))

	file, _ := json.Marshal(liteMovies) // No indent to save space
	_ = ioutil.WriteFile(outputFile, file, 0644)

	log.Println("Done! Created data/moviesLite.json")
}
