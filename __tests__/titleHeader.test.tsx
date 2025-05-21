import React from "react"
import { render } from "@testing-library/react-native"
import TitleHeader from "../src/components/titleHeader"

describe("TitleHeader", () => {
  it("renders the correct text", () => {
    const { getByText } = render(<TitleHeader />)
    const textElement = getByText("Match the plot to the movie!")
    expect(textElement).toBeTruthy()
  })
})
