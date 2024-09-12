package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
)

type Movie struct {
	Adult            bool    `json:"adult"`
	BackdropPath     string  `json:"backdrop_path"`
	GenreIds         []int   `json:"genre_ids"`
	ID               int     `json:"id"`
	OriginalLanguage string  `json:"original_language"`
	OriginalTitle    string  `json:"original_title"`
	Overview         string  `json:"overview"`
	Popularity       float64 `json:"popularity"`
	PosterPath       string  `json:"poster_path"`
	ReleaseDate      string  `json:"release_date"`
	Title            string  `json:"title"`
	Video            bool    `json:"video"`
	VoteAverage      float64 `json:"vote_average"`
	VoteCount        int     `json:"vote_count"`
}

type Config struct {
	TMDBKey string `json:"TMDBKey"`
}

type TMDBMoviesReponse struct {
	Page         int     `json:"page"`
	Results      []Movie `json:"results"`
	TotalPages   int     `json:"total_pages"`
	TotalResults int     `json:"total_results"`
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

func URLS(pages int) []string {
	urls := make([]string, pages)

	for page := 0; page < pages; page++ {
		path := "/3/discover/movie/"
		url := url.URL{
			Scheme: "https",
			Host:   "api.themoviedb.org",
			Path:   path,
		}
		q := url.Query()
		q.Set("page", strconv.Itoa(page))
		q.Set("include_adult", "false")
		q.Set("include_video", "false")
		q.Set("language", "en-US")
		q.Set("sort_by", "popularity.desc")
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
	fileName := "popular_movies_raw.json"
	max_pages := 3
	urls := URLS(max_pages)
	f, err := os.Create(fileName)
	if err != nil {
		fmt.Printf(err.Error())
	}
	defer f.Close()

	for page, url := range urls {
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
		var validResponse TMDBMoviesReponse
		err = json.Unmarshal(*data, &validResponse)
		if err != nil {
			fmt.Printf(err.Error())
		}

		if validResponse.Page == page+1 {
			WriteToFile(f, string(body))
		}
	}
}
