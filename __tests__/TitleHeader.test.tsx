import React from "react"
import { render } from "@testing-library/react-native"
import TitleHeader from "../src/components/titleHeader"

describe("TitleHeader", () => {
  it("renders the main header text", () => {
    const { getByText } = render(<TitleHeader />)
    expect(getByText("TALKIE-TRIVIA")).toBeTruthy()
  })

  it("renders the subheader text", () => {
    const { getByText } = render(<TitleHeader />)
    expect(getByText("guess the movie, given its summary")).toBeTruthy()
  })
})
