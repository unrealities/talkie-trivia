package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"
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

type TMDBCreditsResponse struct {
	ID   int `json:"id"`
	Cast []struct {
		Adult              bool    `json:"adult"`
		Gender             int     `json:"gender"`
		ID                 int     `json:"id"`
		KnownForDepartment string  `json:"known_for_department"`
		Name               string  `json:"name"`
		OriginalName       string  `json:"original_name"`
		Popularity         float64 `json:"popularity"`
		ProfilePath        string  `json:"profile_path"`
		CastID             int     `json:"cast_id"`
		Character          string  `json:"character"`
		CreditID           string  `json:"credit_id"`
		Order              int     `json:"order"`
	} `json:"cast"`
	Crew []struct {
		Adult              bool    `json:"adult"`
		Gender             int     `json:"gender"`
		ID                 int     `json:"id"`
		KnownForDepartment string  `json:"known_for_department"`
		Name               string  `json:"name"`
		OriginalName       string  `json:"original_name"`
		Popularity         float64 `json:"popularity"`
		ProfilePath        string  `json:"profile_path"`
		CreditID           string  `json:"credit_id"`
		Department         string  `json:"department"`
		Job                string  `json:"job"`
	} `json:"crew"`
}

func TMDBKey() string {
	configFile, err := os.Open("secrets.json")
	if err != nil {
		fmt.Println(err)
	}
	defer configFile.Close()

	secretsBytes, _ := ioutil.ReadAll(configFile)
	var config Config
	json.Unmarshal(secretsBytes, &config)
	return config.TMDBKey
}

func URLS() []string {
	moviesFile, err := os.Open("movies.json")
	if err != nil {
		fmt.Println(err)
	}
	defer moviesFile.Close()

	byteValue, _ := ioutil.ReadAll(moviesFile)
	var movies []PopularMovie
	json.Unmarshal(byteValue, &movies)

	urls := make([]string, len(movies))

	for _, movie := range movies {
		path := "/3/movie/" + strconv.Itoa(movie.ID) + "/credits"
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
	fileName := "credits.txt"
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
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Printf(err.Error())
		}

		// check for error response
		data := (*json.RawMessage)(&body)
		var validResponse TMDBCreditsResponse
		err = json.Unmarshal(*data, &validResponse)
		if err != nil {
			fmt.Printf(err.Error())
		}

		if validResponse.ID > 0 {
			WriteToFile(f, string(body))
		}
	}
}
