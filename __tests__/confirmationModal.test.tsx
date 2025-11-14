import React, { ReactElement } from "react"
import {
  render,
  screen,
  fireEvent,
  RenderOptions,
} from "@testing-library/react-native"
import { ThemeProvider } from "../src/contexts/themeContext"
import ConfirmationModal from "../src/components/confirmationModal"
import { hapticsService } from "../src/utils/hapticsService"

// --- Mocking Dependencies ---

// We mock the haptics service to verify that the correct feedback is triggered.
jest.mock("../src/utils/hapticsService", () => ({
  hapticsService: {
    light: jest.fn(),
    heavy: jest.fn(),
  },
}))

// --- Test Setup ---

// Custom render helper with ThemeProvider for consistency with other tests.
const renderWithTheme = (ui: ReactElement, options?: RenderOptions) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

// --- Test Suite ---

describe("ConfirmationModal Component", () => {
  // Create mock functions for the callbacks.
  const onConfirmMock = jest.fn()
  const onCancelMock = jest.fn()

  // Define default props to use in tests.
  const defaultProps = {
    isVisible: true,
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    confirmText: "Yes, Confirm",
    cancelText: "No, Cancel",
    onConfirm: onConfirmMock,
    onCancel: onCancelMock,
  }

  // Before each test, clear the mock call history to ensure test isolation.
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // --- Test Cases ---

  describe("Rendering Logic", () => {
    it("should not be visible when isVisible prop is false", () => {
      renderWithTheme(<ConfirmationModal {...defaultProps} isVisible={false} />)

      // queryByTestId returns null if the element is not found, which is what we expect.
      expect(screen.queryByTestId("confirmation-modal-container")).toBeNull()
    })

    it("should render correctly with all props when isVisible is true", () => {
      renderWithTheme(<ConfirmationModal {...defaultProps} />)

      // The modal container should be in the DOM.
      expect(screen.getByTestId("confirmation-modal-container")).toBeTruthy()

      // Check if all the text content is rendered correctly.
      expect(screen.getByText("Confirm Action")).toBeTruthy()
      expect(screen.getByText("Are you sure you want to proceed?")).toBeTruthy()
      expect(screen.getByText("Yes, Confirm")).toBeTruthy()
      expect(screen.getByText("No, Cancel")).toBeTruthy()
    })
  })

  describe("User Interactions", () => {
    it("should call onConfirm and trigger heavy haptic feedback when confirm is pressed", () => {
      renderWithTheme(<ConfirmationModal {...defaultProps} />)

      const confirmButton = screen.getByText("Yes, Confirm")
      fireEvent.press(confirmButton)

      // Verify that the correct callbacks were called.
      expect(onConfirmMock).toHaveBeenCalledTimes(1)
      expect(onCancelMock).not.toHaveBeenCalled()

      // Verify that the correct haptic feedback was triggered.
      expect(hapticsService.heavy).toHaveBeenCalledTimes(1)
      expect(hapticsService.light).not.toHaveBeenCalled()
    })

    it("should call onCancel and trigger light haptic feedback when cancel is pressed", () => {
      renderWithTheme(<ConfirmationModal {...defaultProps} />)

      const cancelButton = screen.getByText("No, Cancel")
      fireEvent.press(cancelButton)

      // Verify that the correct callbacks were called.
      expect(onCancelMock).toHaveBeenCalledTimes(1)
      expect(onConfirmMock).not.toHaveBeenCalled()

      // Verify that the correct haptic feedback was triggered.
      expect(hapticsService.light).toHaveBeenCalledTimes(1)
      expect(hapticsService.heavy).not.toHaveBeenCalled()
    })

    it("should call onCancel when the modal's onRequestClose is triggered", () => {
      renderWithTheme(<ConfirmationModal {...defaultProps} />)

      const modalContainer = screen.getByTestId("confirmation-modal-container")

      // Firing 'requestClose' simulates a user dismissing the modal (e.g., Android back button).
      fireEvent(modalContainer, "requestClose")

      expect(onCancelMock).toHaveBeenCalledTimes(1)
      expect(onConfirmMock).not.toHaveBeenCalled()

      // The component also calls light haptics on cancel.
      expect(hapticsService.light).toHaveBeenCalledTimes(1)
      expect(hapticsService.heavy).not.toHaveBeenCalled()
    })
  })
})
