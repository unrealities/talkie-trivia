import React, { memo, useMemo } from "react"
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
  ListRenderItem,
  StyleProp,
  ViewStyle,
} from "react-native"
import Animated from "react-native-reanimated"
import { BasicMovie } from "../models/movie"
import { getPickerStyles } from "../styles/pickerStyles"
import { useTheme } from "../contexts/themeContext"

interface PickerUIProps {
  query: string
  isSearching: boolean
  results: readonly BasicMovie[]
  showResults: boolean
  animatedInputStyle: StyleProp<ViewStyle>
  isInteractionsDisabled: boolean
  handleInputChange: (text: string) => void
  renderItem: ListRenderItem<BasicMovie>
}

export const PickerUI: React.FC<PickerUIProps> = memo(
  ({
    query,
    isSearching,
    results,
    showResults,
    animatedInputStyle,
    isInteractionsDisabled,
    handleInputChange,
    renderItem,
  }) => {
    const { colors } = useTheme()
    const pickerStyles = useMemo(() => getPickerStyles(colors), [colors])

    return (
      <View style={pickerStyles.container}>
        <Animated.View style={animatedInputStyle}>
          <View style={pickerStyles.inputContainer}>
            <TextInput
              accessible
              accessibilityRole="search"
              aria-label="Search for a movie to make a guess"
              maxLength={100}
              onChangeText={handleInputChange}
              placeholder="Search for a movie title..."
              placeholderTextColor={colors.textSecondary}
              style={[
                pickerStyles.input,
                isInteractionsDisabled && {
                  backgroundColor: colors.border,
                },
              ]}
              value={query}
              editable={!isInteractionsDisabled}
            />
            {isSearching && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={pickerStyles.activityIndicator}
              />
            )}
          </View>
        </Animated.View>

        {/* The results container will now render as an overlay due to the styles */}
        {showResults && (
          <View style={pickerStyles.resultsContainer}>
            {isSearching ? (
              <Text style={pickerStyles.noResultsText}>Searching...</Text>
            ) : results.length > 0 ? (
              <>
                <FlatList
                  data={results}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  style={pickerStyles.resultsShow}
                  keyboardShouldPersistTaps="handled"
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={11}
                />
                <View style={pickerStyles.previewHintContainer}>
                  <Text style={pickerStyles.previewHintText}>
                    💡 Hold any result to preview
                  </Text>
                </View>
              </>
            ) : query.length >= 2 ? (
              <Text style={pickerStyles.noResultsText}>
                No movies found for "{query}"
              </Text>
            ) : null}
          </View>
        )}
      </View>
    )
  }
)
