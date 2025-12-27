import { u } from "../../src/styles/utils"

describe("Utils: Global Styles (u)", () => {
  it("should define flexbox utilities", () => {
    expect(u.flex).toEqual({ flex: 1 })
    expect(u.flexRow).toEqual({ flexDirection: "row" })
    expect(u.justifyCenter).toEqual({ justifyContent: "center" })
    expect(u.alignCenter).toEqual({ alignItems: "center" })
  })

  it("should define sizing utilities", () => {
    expect(u.wFull).toEqual({ width: "100%" })
    expect(u.hFull).toEqual({ height: "100%" })
  })

  it("should define spacing utilities correctly", () => {
    expect(u.pSm).toHaveProperty("padding")
    expect(u.mSm).toHaveProperty("margin")

    expect(u.mtMd).toHaveProperty("marginTop")
    // mbLg does not exist, checking mbMd instead
    expect(u.mbMd).toHaveProperty("marginBottom")
    expect(u.pxSm).toHaveProperty("paddingHorizontal")
  })

  it("should define text utilities", () => {
    expect(u.textCenter).toEqual({ textAlign: "center" })
    expect(u.fontBold).toHaveProperty("fontFamily", "Arvo-Bold")
  })
})
