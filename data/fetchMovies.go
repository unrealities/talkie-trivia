package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/url"
	"os"
	"strconv"
	"sync"
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
	moviesFile, err := os.Open("popular_movies_05_24_2022.json")
	if err != nil {
		fmt.Println(err)
	}
	defer moviesFile.Close()

	byteValue, _ := ioutil.ReadAll(moviesFile)
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
	fileName := "data.txt"
	data := URLS()
	f, err := os.Create(fileName)
	if err != nil {
		fmt.Printf(err.Error())
	}
	defer f.Close()

	var wg sync.WaitGroup
	for i := 1; i <= 5; i++ {
		for _, d := range data {
			wg.Add(1)
			go func() {
				defer wg.Done()
				WriteToFile(f, d)
			}()
		}
	}
	wg.Wait()
}
