import { jest } from "@jest/globals"

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.default.call = () => { };

  return Reanimated;
});

const originalWarn = console.warn
console.warn = (...args) => {
  const warningMessage = args[0]
  if (
    typeof warningMessage === "string" &&
    warningMessage.includes("defaultProps") &&
    (warningMessage.includes("VictoryPie") ||
      warningMessage.includes("Slice") ||
      warningMessage.includes("VictoryLabel"))
  ) {
    return // Suppress the warning
  }
  originalWarn.apply(console, args)
}
