import React, { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react-native"
import { NetworkProvider } from "../contexts/networkContext"
import { AuthProvider } from "../contexts/authContext"
import { GameProvider } from "../contexts/gameContext"

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <NetworkProvider>
      <AuthProvider>
        <GameProvider>{children}</GameProvider>
      </AuthProvider>
    </NetworkProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react-native"
export { customRender as render }
