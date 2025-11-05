import React, { memo } from "react"
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
  ListRenderItem,
  StyleProp,
  ViewStyle,
  TextStyle,
  FlatListProps,
} from "react-native"
import Animated from "react-native-reanimated"
import { BasicTriviaItem } from "../models/trivia"
import { useStyles, Theme } from "../utils/hooks/useStyles"

interface PickerUIProps {
  query: string
  isSearching: boolean
  results: readonly BasicTriviaItem[]
  showResults: boolean
  animatedInputStyle: StyleProp<ViewStyle>
  isInteractionsDisabled: boolean
  handleInputChange: (text: string) => void
  renderItem: ListRenderItem<BasicTriviaItem>
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
    const styles = useStyles(themedStyles)

    const listProps: Partial<FlatListProps<BasicTriviaItem>> = {
      data: results,
      renderItem: renderItem,
      keyExtractor: (item) => item.id.toString(),
      style: styles.resultsList,
      keyboardShouldPersistTaps: "handled",
      initialNumToRender: 10,
      maxToRenderPerBatch: 10,
      windowSize: 11,
    }

    return (
      <View style={styles.container}>
        <Animated.View style={animatedInputStyle}>
          <View style={styles.inputContainer}>
            <TextInput
              accessible
              accessibilityRole="search"
              aria-label="Search for a movie to make a guess"
              maxLength={100}
              onChangeText={handleInputChange}
              placeholder="Search for a movie title..."
              placeholderTextColor={styles.input.placeholderTextColor}
              style={[
                styles.input,
                isInteractionsDisabled && styles.disabledInput,
              ]}
              value={query}
              editable={!isInteractionsDisabled}
            />
            {isSearching && (
              <ActivityIndicator
                size="small"
                color={styles.activityIndicator.color}
                style={styles.activityIndicator}
              />
            )}
          </View>
        </Animated.View>

        {showResults && (
          <View style={styles.resultsContainer}>
            {isSearching ? (
              <Text style={styles.noResultsText}>Searching...</Text>
            ) : results.length > 0 ? (
              <>
                <FlatList {...listProps} />
                <View style={styles.previewHintContainer}>
                  <Text style={styles.previewHintText}>
                    💡 Hold any result to preview
                  </Text>
                </View>
              </>
            ) : query.length >= 2 ? (
              <Text style={styles.noResultsText}>
                No movies found for "{query}"
              </Text>
            ) : null}
          </View>
        )}
      </View>
    )
  }
)

interface PickerUIStyles {
  container: ViewStyle
  inputContainer: ViewStyle
  input: TextStyle & { placeholderTextColor: string }
  disabledInput: ViewStyle
  activityIndicator: ViewStyle & { color: string }
  resultsContainer: ViewStyle
  resultsList: ViewStyle
  noResultsText: TextStyle
  previewHintContainer: ViewStyle
  previewHintText: TextStyle
}

const themedStyles = (theme: Theme): PickerUIStyles => ({
  container: {
    width: "100%",
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  inputContainer: {
    flexDirection: "row",
    position: "relative",
    width: "100%",
  },
  input: {
    flex: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.responsive.scale(8),
    borderWidth: 2,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(14),
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.responsive.scale(12),
    textAlign: "left",
    paddingRight: theme.responsive.scale(40),
    placeholderTextColor: theme.colors.textSecondary,
  },
  disabledInput: {
    backgroundColor: theme.colors.border,
  },
  activityIndicator: {
    position: "absolute",
    right: theme.spacing.small,
    top: theme.responsive.scale(12),
    color: theme.colors.primary,
  },
  resultsContainer: {
    position: "absolute",
    top: theme.responsive.scale(55),
    left: 0,
    right: 0,
    maxHeight: theme.responsive.scale(200),
    backgroundColor: theme.colors.backgroundLight,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.responsive.scale(8),
    ...theme.shadows.medium,
    zIndex: 10,
  },
  resultsList: {
    flex: 1,
  },
  noResultsText: {
    ...theme.typography.bodyText,
    fontSize: theme.responsive.responsiveFontSize(14),
    padding: theme.spacing.medium,
    textAlign: "center",
  },
  previewHintContainer: {
    position: "absolute",
    bottom: theme.spacing.small,
    right: theme.spacing.small,
    backgroundColor: theme.colors.tertiary,
    borderRadius: theme.responsive.scale(12),
    paddingVertical: theme.responsive.scale(4),
    paddingHorizontal: theme.spacing.small,
    zIndex: 1,
    elevation: 1,
  },
  previewHintText: {
    fontFamily: "Arvo-Italic",
    fontSize: theme.responsive.responsiveFontSize(11),
    color: theme.colors.background,
  },
})
