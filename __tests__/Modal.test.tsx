import React from "react"
import { render, fireEvent, screen } from "@testing-library/react-native"
import MovieModal from "../src/components/modal"
import { Movie } from "../src/models/movie"

describe("MovieModal", () => {
  const mockMovie: Movie | null = {
    actors: [],
    director: { id: 1, name: "Test Director", popularity: 8, profile_path: "" },
    genres: [{ id: 1, name: "Action" }],
    id: 123,
    imdb_id: 456,
    overview: "Test overview",
    poster_path: "/test.jpg",
    popularity: 9,
    release_date: "2023-01-01",
    tagline: "Test tagline",
    title: "Test Movie",
    vote_average: 7.5,
    vote_count: 100,
  }

  const mockToggleModal = jest.fn()

  it("renders without movie data", () => {
    render(
      <MovieModal movie={null} show={true} toggleModal={mockToggleModal} />
    )

    expect(screen.getByText("No movie information available")).toBeTruthy()
    fireEvent.press(screen.getByText("Dismiss"))
    expect(mockToggleModal).toHaveBeenCalledWith(false)
  })

  it("renders with movie data and closes when 'Close' is pressed", () => {
    render(
      <MovieModal movie={mockMovie} show={true} toggleModal={mockToggleModal} />
    )

    expect(screen.getByText("Test Movie")).toBeTruthy() // Assuming Facts component renders movie title
    fireEvent.press(screen.getByText("Close"))
    expect(mockToggleModal).toHaveBeenCalledWith(false)
  })

  it("renders close when modal is shown and 'outside' is tapped", async () => {
    render(
      <MovieModal movie={mockMovie} show={true} toggleModal={mockToggleModal} />
    )
    fireEvent.press(screen.getByTestId("modal-overlay")) // Assuming the outer overlay has this testID
    expect(mockToggleModal).toHaveBeenCalledWith(false)
  })

  it("renders does not close when modal content is tapped", () => {
    render(
      <MovieModal movie={mockMovie} show={true} toggleModal={mockToggleModal} />
    )
    // Assuming the inner modal content has a specific role
    fireEvent.press(screen.getByTestId("modal-content"))
    expect(mockToggleModal).not.toHaveBeenCalled()
  })

  it("renders without crashing when toggled quickly", () => {
    const { rerender } = render(
      <MovieModal
        movie={mockMovie}
        show={false}
        toggleModal={mockToggleModal}
      />
    )

    rerender(
      <MovieModal movie={mockMovie} show={true} toggleModal={mockToggleModal} />
    )
    rerender(
      <MovieModal
        movie={mockMovie}
        show={false}
        toggleModal={mockToggleModal}
      />
    )
    // If the component doesn't crash during these quick changes, the test passes
    expect(true).toBe(true)
  })
})
