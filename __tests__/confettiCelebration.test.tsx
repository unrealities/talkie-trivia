import { render, fireEvent } from "@testing-library/react-native"
import ConfettiCelebration from "../src/components/confettiCelebration"
import ConfettiCannon from "react-native-confetti-cannon"

const mockStart = jest.fn()
jest.mock("react-native-confetti-cannon", () => {
  return {
    __esModule: true,
    default: require("react").forwardRef((props, ref) => {
      const React = require("react")
      const [_, setRendered] = React.useState(false)
      React.useImperativeHandle(ref, () => ({ 
        start: () => {
          if (props.startConfetti) mockStart()
        }
      }), []);
      console.log("MockConfettiCannon rendered")
      return React.createElement("button", { testID: "mock-confetti-cannon", onPress: props.onAnimationEnd });
    })

  };
});



describe("ConfettiCelebration", () => {
  it("starts the confetti cannon when startConfetti is true", () => {
    const { getByTestId } = render(<ConfettiCelebration startConfetti={true} />);
    const confettiCannon = getByTestId("mock-confetti-cannon")
    expect(mockStart).toHaveBeenCalled()
  })

  it("does not start the confetti cannon when startConfetti is false", () => {
    render(<ConfettiCelebration startConfetti={false} />)

    expect(mockStart).not.toHaveBeenCalled()
  })

  it("calls onConfettiStop when the animation ends", () => {
    const onConfettiStop = jest.fn()
    const { getByTestId } = render(<ConfettiCelebration startConfetti={true} onConfettiStop={onConfettiStop} />)
    const mockConfettiCannon = getByTestId("mock-confetti-cannon")
    fireEvent.press(mockConfettiCannon)
    expect(onConfettiStop).toHaveBeenCalled()
  })

  it("does not call onConfettiStop if it is not provided", () => {
    const { getByTestId } = render(<ConfettiCelebration startConfetti={true} />)
    const mockConfettiCannon = getByTestId("mock-confetti-cannon")
    fireEvent.press(mockConfettiCannon)
  })
})