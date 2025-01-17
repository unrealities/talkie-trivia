import "expo-router/entry";

import React from "react"
import { Redirect } from "expo-router"

const Index = () => {
  return <Redirect href="/game" />
}

export default Index
