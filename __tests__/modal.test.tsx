import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import MovieModal from "../src/components/modal"
import { Movie } from "../src/models/movie"

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  release_date: "2023-01-01",
  poster_path: "/test.jpg",
  vote_average: 7.5,
  overview: "This is a test movie.",
  tagline: "Test tagline",
  genres: [{ id: 1, name: "Action" }],
  credits: {
    cast: [
      {
        id: 1,
        name: "Actor One",
        character: "Character One",
        profile_path: "/actor1.jpg",
        order: 1,
        job: "Acting",
      },
    ],
    crew: [
      {
        id: 2,
        name: "Director One",
        job: "Director",
        profile_path: "/director1.jpg",
        department: "Directing",
      },
    ],
  },
  runtime: 120,
}

describe("MovieModal", () => {
  it("renders correctly when hidden", () => {
    const toggleModal = jest.fn()
    const { queryByTestId } = render(
      <MovieModal movie={mockMovie} show={false} toggleModal={toggleModal} />
    )
    expect(queryByTestId("movie-modal")).toBeNull()
  })

  it("renders correctly when shown with a movie", () => {
    const toggleModal = jest.fn()
    const { getByText } = render(
      <MovieModal movie={mockMovie} show={true} toggleModal={toggleModal} />
    )
    expect(getByText("Test Movie")).toBeTruthy()
    expect(getByText("Close")).toBeTruthy()
  })

  it("renders correctly when shown without a movie", () => {
    const toggleModal = jest.fn()
    const { getByText } = render(
      <MovieModal movie={null} show={true} toggleModal={toggleModal} />
    )
    expect(getByText("No movie information available")).toBeTruthy()
    expect(getByText("Dismiss")).toBeTruthy()
  })

  it("calls toggleModal when the close button is pressed", () => {
    const toggleModal = jest.fn()
    const { getByText } = render(
      <MovieModal movie={mockMovie} show={true} toggleModal={toggleModal} />
    )
    fireEvent.press(getByText("Close"))
    expect(toggleModal).toHaveBeenCalledWith(false)
  })

  it("calls toggleModal when the dismiss button is pressed", () => {
    const toggleModal = jest.fn()
    const { getByText } = render(
      <MovieModal movie={null} show={true} toggleModal={toggleModal} />
    )
    fireEvent.press(getByText("Dismiss"))
    expect(toggleModal).toHaveBeenCalledWith(false)
  })

  it("calls toggleModal when tapping outside the modal", () => {
    const toggleModal = jest.fn()
    const { getByLabelText } = render(
      <MovieModal movie={mockMovie} show={true} toggleModal={toggleModal} />
    )
    // Assuming the Pressable with accessibilityLabel "Close modal by tapping outside" covers the background
    fireEvent.press(getByLabelText("Close modal by tapping outside"))
    expect(toggleModal).toHaveBeenCalledWith(false)
  })
})
