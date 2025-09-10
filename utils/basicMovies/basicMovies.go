package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"sort"
	"strings"
)

type BasicMovie struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	ReleaseDate string `json:"release_date"`
	PosterPath  string `json:"poster_path"`
}

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

func main() {
	jsonFile, err := os.Open("../../data/movies.json")
	if err != nil {
		fmt.Println(err)
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var movies []DetailedMovie
	json.Unmarshal([]byte(byteValue), &movies)

	basicMovies := []BasicMovie{}
	for _, movie := range movies {
		if movie.Runtime > 70 &&
			movie.Popularity > 7 &&
			movie.VoteCount > 100 {
			stringYearArr := strings.Split(movie.ReleaseDate, "-")
			year := stringYearArr[0]
			id := movie.ID
			title := movie.Title

			for _, m2 := range movies {
				if m2.Title == title && m2.ID != id {
					title = title + " (" + year + ")"
				}
			}

			m := BasicMovie{
				ID:          id,
				Title:       title,
				ReleaseDate: movie.ReleaseDate,
				PosterPath:  movie.PosterPath,
			}
			basicMovies = append(basicMovies, m)
		}

	}

	sort.Slice(basicMovies, func(i, j int) bool {
		return basicMovies[i].Title < basicMovies[j].Title
	})

	bm, err := json.MarshalIndent(basicMovies, "", "  ")
	if err != nil {
		log.Fatal(err)
	}

	f, err := os.Create("basicMovies.json")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	_, err = f.WriteString(string(bm))
	if err != nil {
		log.Fatal(err)
	}
}
