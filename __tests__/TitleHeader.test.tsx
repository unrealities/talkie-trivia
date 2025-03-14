import React from "react"
import { render, screen } from "@testing-library/react-native"
import TitleHeader from "../src/components/titleHeader"

describe("TitleHeader", () => {
  it("renders the main header text", () => {
    render(<TitleHeader />)
    expect(screen.getByText("Match the plot to the movie!")).toBeTruthy()
  })
})
