import React, { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react-native"
import { NetworkProvider } from "../contexts/networkContext"
import { AssetsProvider } from "../contexts/assetsContext"
import { AuthProvider } from "../contexts/authContext"
import { GameDataProvider } from "../contexts/gameDataContext"

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <NetworkProvider>
      <AssetsProvider>
        <AuthProvider>
          <GameDataProvider>{children}</GameDataProvider>
        </AuthProvider>
      </AssetsProvider>
    </NetworkProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react-native"
export { customRender as render }
