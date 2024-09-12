package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"
)

type PopularMovie struct {
	Adult         bool    `json:"adult"`
	ID            int     `json:"id"`
	OriginalTitle string  `json:"original_title"`
	Popularity    float64 `json:"popularity"`
	Video         bool    `json:"video"`
}

type Config struct {
	TMDBKey string `json:"TMDBKey"`
}

type TMDBDetailsResponse struct {
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

func TMDBKey() string {
	configFile, err := os.Open("../secrets.json")
	if err != nil {
		fmt.Println(err)
	}
	defer configFile.Close()

	secretsBytes, _ := io.ReadAll(configFile)
	var config Config
	json.Unmarshal(secretsBytes, &config)
	return config.TMDBKey
}

func URLS() []string {
	now := time.Now()
	d := now.Format("01_02_2006")
	fileName := fmt.Sprintf("popular_movies_%s.json", d)
	moviesFile, err := os.Create(fileName)
	if err != nil {
		fmt.Println(err)
	}
	defer moviesFile.Close()

	byteValue, _ := io.ReadAll(moviesFile)
	var movies []PopularMovie
	json.Unmarshal(byteValue, &movies)

	urls := make([]string, len(movies))

	for _, movie := range movies {
		path := "/3/movie/" + strconv.Itoa(movie.ID)
		url := url.URL{
			Scheme: "https",
			Host:   "api.themoviedb.org",
			Path:   path,
		}
		q := url.Query()
		q.Set("api_key", TMDBKey())
		url.RawQuery = q.Encode()
		urls = append(urls, url.String())
	}
	return urls
}

func WriteToFile(file *os.File, data string) {
	dataToWrite := data + "\n"
	_, err := file.WriteString(dataToWrite)
	if err != nil {
		fmt.Printf(err.Error())
	}
}

func main() {
	fileName := "movies.txt"
	urls := URLS()
	f, err := os.Create(fileName)
	if err != nil {
		fmt.Printf(err.Error())
	}
	defer f.Close()

	for _, url := range urls {
		if url == "" {
			continue
		}
		resp, err := http.Get(url)
		if err != nil {
			fmt.Printf(err.Error())
		}
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Printf(err.Error())
		}

		// check for error response
		data := (*json.RawMessage)(&body)
		var validResponse TMDBDetailsResponse
		err = json.Unmarshal(*data, &validResponse)
		if err != nil {
			fmt.Printf(err.Error())
		}

		if validResponse.OriginalTitle > "" {
			WriteToFile(f, string(body))
		}
	}
}
