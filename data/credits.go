package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

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

type Actor struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Popularity  float64 `json:"popularity"`
	ProfilePath string  `json:"profile_path"`
}

func main() {
	jsonFile, err := os.Open("credits.json")
	if err != nil {
		fmt.Println(err)
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var movies []TMDBCreditsResponse
	json.Unmarshal([]byte(byteValue), &movies)

	actors := make(map[int]Actor)
	for _, movie := range movies {
		for _, cast := range movie.Cast {
			if cast.Popularity > 20 || cast.Order < 3 {
				actors[cast.ID] = Actor{
					ID:          cast.ID,
					Name:        cast.Name,
					Popularity:  cast.Popularity,
					ProfilePath: cast.ProfilePath,
				}
			}
		}
	}

	for _, actor := range actors {
		fmt.Println(actor.Name)
	}
	fmt.Println(len(actors))
}
