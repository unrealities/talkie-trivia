import React, { memo } from "react"
import { View, Pressable, Text, StyleProp, ViewStyle } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { hintStyles } from "../styles/hintStyles"
import { responsive, colors } from "../styles/global"

type HintType = "decade" | "director" | "actor" | "genre"
type HintStatus = "available" | "used" | "disabled"

interface HintButtonProps {
  hintType: HintType
  iconName: keyof typeof Icon.glyphMap
  label: string
  onPress: (type: HintType) => void
  status: HintStatus
  accessibilityHintCount: number
}

const HintButton: React.FC<HintButtonProps> = ({
  hintType,
  iconName,
  label,
  onPress,
  status,
  accessibilityHintCount,
}) => {
  const buttonStyle: StyleProp<ViewStyle> = [hintStyles.hintButton]
  if (status === "disabled") {
    buttonStyle.push(hintStyles.disabled)
  } else if (status === "used") {
    buttonStyle.push(hintStyles.usedHintButton)
  }

  const getAccessibilityLabel = () => {
    switch (status) {
      case "used":
        return `Re-view the ${label.toLowerCase()} hint.`
      case "disabled":
        return `${label} hint unavailable.`
      case "available":
      default:
        return `Get the movie's ${label.toLowerCase()} hint. ${accessibilityHintCount} hints available.`
    }
  }

  return (
    <Pressable
      style={buttonStyle}
      onPress={() => onPress(hintType)}
      disabled={status === "disabled"}
      accessible
      accessibilityRole="button"
      accessibilityState={{ disabled: status === "disabled" }}
      accessibilityLabel={getAccessibilityLabel()}
    >
      <Icon
        name={iconName}
        size={responsive.scale(20)}
        color={
          status === "disabled"
            ? colors.grey
            : status === "used"
            ? colors.tertiary
            : colors.secondary
        }
      />
      <Text
        style={[
          hintStyles.buttonTextSmall,
          status === "disabled" && { color: colors.grey },
          status === "used" && { color: colors.tertiary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

interface HintUIProps {
  showHintOptions: boolean
  displayedHintText: string | null
  hintLabelText: string
  isToggleDisabled: boolean
  hintsAvailable: number
  hintStatuses: Record<HintType, HintStatus>

  handleToggleHintOptions: () => void
  handleHintSelection: (type: HintType) => void
}

const HintUI: React.FC<HintUIProps> = memo(
  ({
    showHintOptions,
    displayedHintText,
    hintLabelText,
    isToggleDisabled,
    hintsAvailable,
    hintStatuses,
    handleToggleHintOptions,
    handleHintSelection,
  }) => {
    return (
      <View style={hintStyles.container}>
        <Pressable
          onPress={handleToggleHintOptions}
          disabled={isToggleDisabled}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ disabled: isToggleDisabled }}
          accessibilityLabel={hintLabelText}
          style={isToggleDisabled ? hintStyles.disabled : {}}
        >
          <Text
            style={[
              hintStyles.hintLabel,
              isToggleDisabled && { color: colors.grey },
            ]}
          >
            {hintLabelText}
          </Text>
        </Pressable>

        {showHintOptions && (
          <View style={hintStyles.hintButtonsContainer}>
            <View style={hintStyles.hintButtonArea}>
              <HintButton
                hintType="decade"
                iconName="calendar"
                label="Decade"
                onPress={handleHintSelection}
                status={hintStatuses.decade}
                accessibilityHintCount={hintsAvailable}
              />
              <HintButton
                hintType="director"
                iconName="video-camera"
                label="Director"
                onPress={handleHintSelection}
                status={hintStatuses.director}
                accessibilityHintCount={hintsAvailable}
              />
              <HintButton
                hintType="actor"
                iconName="user"
                label="Actor"
                onPress={handleHintSelection}
                status={hintStatuses.actor}
                accessibilityHintCount={hintsAvailable}
              />
              <HintButton
                hintType="genre"
                iconName="folder-open"
                label="Genre"
                onPress={handleHintSelection}
                status={hintStatuses.genre}
                accessibilityHintCount={hintsAvailable}
              />
            </View>
          </View>
        )}

        {displayedHintText && (
          <Text style={hintStyles.hintText}>{displayedHintText}</Text>
        )}
      </View>
    )
  }
)

export default HintUI
