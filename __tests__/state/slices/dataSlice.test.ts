import { act, renderHook } from "@testing-library/react-native"
import { useGameStore } from "../../../src/state/gameStore"

describe("State: Data Slice", () => {
  const initialState = useGameStore.getState()

  beforeEach(() => {
    useGameStore.setState(initialState, true)
  })

  it("should set game data correctly", () => {
    const { result } = renderHook(() => useGameStore())

    const mockFullItems = [{ id: 1, title: "Full" }] as any
    const mockBasicItems = [{ id: 1, title: "Basic" }] as any

    act(() => {
      result.current.setGameData(mockFullItems, mockBasicItems)
    })

    expect(result.current.fullItems).toBe(mockFullItems)
    expect(result.current.basicItems).toBe(mockBasicItems)
  })
})
