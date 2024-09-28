package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
)

type DetailedMovie struct {
	Adult               bool        `json:"adult"`
	BackdropPath        string      `json:"backdrop_path"`
	BelongsToCollection interface{} `json:"belongs_to_collection"`
	Budget              int         `json:"budget"`
	Genres              []Genre     `json:"genres"`
	Homepage            string      `json:"homepage"`
	ID                  int         `json:"id"`
	ImdbID              string      `json:"imdb_id"`
	OriginalLanguage    string      `json:"original_language"`
	OriginalTitle       string      `json:"original_title"`
	Overview            string      `json:"overview"`
	Popularity          float64     `json:"popularity"`
	PosterPath          string      `json:"poster_path"`
	ProductionCompanies []struct {
		ID            int    `json:"id"`
		LogoPath      string `json:"logo_path"`
		Name          string `json:"name"`
		OriginCountry string `json:"origin_country"`
	} `json:"production_companies"`
	ProductionCountries []struct {
		Iso31661 string `json:"iso_3166_1"`
		Name     string `json:"name"`
	} `json:"production_countries"`
	ReleaseDate     string `json:"release_date"`
	Revenue         int    `json:"revenue"`
	Runtime         int    `json:"runtime"`
	SpokenLanguages []struct {
		EnglishName string `json:"english_name"`
		Iso6391     string `json:"iso_639_1"`
		Name        string `json:"name"`
	} `json:"spoken_languages"`
	Status      string  `json:"status"`
	Tagline     string  `json:"tagline"`
	Title       string  `json:"title"`
	Video       bool    `json:"video"`
	VoteAverage float64 `json:"vote_average"`
	VoteCount   int     `json:"vote_count"`
}

type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Movie struct {
	Actors      []MovieActor  `json:"actors"`
	Director    MovieDirector `json:"director"`
	Genres      []Genre       `json:"genres"`
	ImdbID      string        `json:"imdb_id"`
	ID          int           `json:"id"`
	Overview    string        `json:"overview"`
	Popularity  float64       `json:"popularity"`
	PosterPath  string        `json:"poster_path"`
	ReleaseDate string        `json:"release_date"`
	Tagline     string        `json:"tagline"`
	Title       string        `json:"title"`
	VoteAverage float64       `json:"vote_average"`
	VoteCount   int           `json:"vote_count"`
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

func main() {
	actorFile, err := os.Open("../../data/movieActors.json")
	if err != nil {
		fmt.Println(err)
	}
	defer actorFile.Close()

	actorByteValue, _ := io.ReadAll(actorFile)

	var actors map[int][]MovieActor
	json.Unmarshal([]byte(actorByteValue), &actors)

	directorFile, err := os.Open("../../data/movieDirectors.json")
	if err != nil {
		fmt.Println(err)
	}
	defer actorFile.Close()

	directorByteValue, _ := io.ReadAll(directorFile)

	var directors map[int]MovieDirector
	json.Unmarshal([]byte(directorByteValue), &directors)

	jsonFile, err := os.Open("../../data/movies.json")
	if err != nil {
		fmt.Println(err)
	}
	defer jsonFile.Close()

	byteValue, _ := io.ReadAll(jsonFile)

	var movies []DetailedMovie
	json.Unmarshal([]byte(byteValue), &movies)

	popularMovies := []Movie{}
	for _, movie := range movies {
		if len(movie.Overview) < 400 &&
			len(movie.Overview) > 60 &&
			movie.Runtime > 75 &&
			movie.Popularity > 10 &&
			movie.VoteAverage > 4.9 &&
			movie.VoteCount > 400 {
			genres := []Genre{}
			for _, genre := range movie.Genres {
				genres = append(genres, genre)
			}
			m := Movie{
				Actors:      actors[movie.ID],
				Director:    directors[movie.ID],
				Genres:      genres,
				ImdbID:      movie.ImdbID,
				ID:          movie.ID,
				Overview:    movie.Overview,
				Popularity:  movie.Popularity,
				PosterPath:  movie.PosterPath,
				ReleaseDate: movie.ReleaseDate,
				Tagline:     movie.Tagline,
				Title:       movie.Title,
				VoteAverage: movie.VoteAverage,
				VoteCount:   movie.VoteCount,
			}
			popularMovies = append(popularMovies, m)
		}

	}

	pm, err := json.MarshalIndent(popularMovies, "", "  ")
	if err != nil {
		log.Fatal(err)
	}

	f, err := os.Create("popularMovies.json")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	_, err = f.WriteString(string(pm))
	if err != nil {
		log.Fatal(err)
	}
}
