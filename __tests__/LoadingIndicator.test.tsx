import React from "react"
import { render, screen } from "@testing-library/react-native"
import LoadingIndicator from "../src/components/loadingIndicator"

describe("LoadingIndicator", () => {
  it("renders an activity indicator", () => {
    render(<LoadingIndicator />)
    expect(screen.getByTestId("activity-indicator")).toBeTruthy()
  })
})
