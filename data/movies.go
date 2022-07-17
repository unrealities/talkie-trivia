package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

type DetailedMovie struct {
	Adult               bool        `json:"adult"`
	BackdropPath        string      `json:"backdrop_path"`
	BelongsToCollection interface{} `json:"belongs_to_collection"`
	Budget              int         `json:"budget"`
	Genres              []struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	} `json:"genres"`
	Homepage            string  `json:"homepage"`
	ID                  int     `json:"id"`
	ImdbID              string  `json:"imdb_id"`
	OriginalLanguage    string  `json:"original_language"`
	OriginalTitle       string  `json:"original_title"`
	Overview            string  `json:"overview"`
	Popularity          float64 `json:"popularity"`
	PosterPath          string  `json:"poster_path"`
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

type Movie struct {
	ID          int    `json:"id"`
	Overview    string `json:"overview"`
	PosterPath  string `json:"poster_path"`
	ReleaseDate string `json:"release_date"`
	Tagline     string `json:"tagline"`
	Title       string `json:"title"`
}

func main() {
	jsonFile, err := os.Open("movies.json")
	if err != nil {
		fmt.Println(err)
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var movies []DetailedMovie
	json.Unmarshal([]byte(byteValue), &movies)

	popularMovies := make(map[int]Movie)
	for _, movie := range movies {
		if len(movie.Overview) > 350 ||
			len(movie.Overview) < 60 ||
			movie.Runtime < 80 ||
			movie.Popularity < 40 ||
			movie.VoteCount < 100 {
			m := Movie{
				ID:          movie.ID,
				Overview:    movie.Overview,
				PosterPath:  movie.PosterPath,
				ReleaseDate: movie.ReleaseDate,
				Tagline:     movie.Tagline,
				Title:       movie.Title,
			}
			popularMovies[m.ID] = m
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