import React from "react"
import { render } from "@testing-library/react-native"
import LoadingIndicator from "../src/components/loadingIndicator"

describe("LoadingIndicator", () => {
  it("renders an activity indicator", () => {
    const { getByTestId } = render(<LoadingIndicator />)
    expect(getByTestId("activity-indicator")).toBeTruthy() // Assuming ActivityIndicator has a testID prop
  })
})
