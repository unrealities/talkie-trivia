import React, { useMemo } from "react"
import { View, Text } from "react-native"
import { useTheme } from "../../contexts/themeContext"
import { getMovieStyles } from "../../styles/movieStyles"

interface FullPlotSectionProps {
  overview: string
}

const FullPlotSection: React.FC<FullPlotSectionProps> = ({ overview }) => {
  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])

  return (
    <View style={movieStyles.fullOverviewContainer}>
      <Text style={movieStyles.fullOverviewTitle}>The Full Plot</Text>
      <Text style={movieStyles.fullOverviewText}>{overview}</Text>
    </View>
  )
}

export default FullPlotSection
