import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { useMemo, useState } from 'react'
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export type TabButtonType = {
  title: string
}

type TabButtonsProps = {
  buttons: TabButtonType[]
  selectedTab: number
  setSelectedTab: (index: number) => void
}

const TabButtons = ({ buttons, selectedTab, setSelectedTab }: TabButtonsProps) => {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 })
  const [index, setIndex] = useState(selectedTab)
  const buttonWidth = dimensions.width / buttons.length

  const tabPositionX = useSharedValue(0)

  const onTabbarLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    })
  }

  const handlePress = (index: number) => {
    setSelectedTab(index)
    setIndex(index)
  }

  tabPositionX.value = useMemo(() => {
    return withTiming(buttonWidth * index, {}, () => {
      runOnJS(handlePress)(index)
    })
  }, [index])
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    }
  })

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            backgroundColor: BackgroundColor.LightTheme.Primary,
            borderRadius: 8,
            width: buttonWidth,
            height: dimensions.height,
            marginHorizontal: 4,
            marginVertical: 4,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 3,
            shadowColor: '#101828',
          },
        ]}
      ></Animated.View>
      <View onLayout={onTabbarLayout} style={{ flexDirection: 'row' }}>
        {buttons.map((button, index) => (
          <Pressable key={index} style={[styles.button]} onPress={() => handlePress(index)}>
            <Text
              style={[
                styles.buttonText,
                index === selectedTab
                  ? { color: BrandColor.PrimaryColor[400], fontWeight: '600' }
                  : {},
              ]}
            >
              {button.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}
export default TabButtons
const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    gap: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: BackgroundColor.LightTheme.Tertiary,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '400',
    alignSelf: 'center',
    color: TextColor.Placeholder,
  },
})
