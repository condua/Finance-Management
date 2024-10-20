import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { type BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BrandColor, NeutralColor } from '@/src/constants/Colors'
import { Pressable } from 'react-native'
import { useMemo, useState } from 'react'

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets()
  const hideTabs = useMemo(() => {
     for (let route of state.routes) {
        const { options } = descriptors[route.key]
        if (JSON.stringify(options.tabBarStyle) === JSON.stringify({ display: 'none' })) {
          return true
        }
      }
   }, [state])
  return (
    <View style={[styles.tabBarContainer, { bottom: bottom }, hideTabs ? {display: 'none'} : {display: 'flex'} ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name
        // remove +not-found or _sitemap from tabs
        if (['_sitemap', '+not-found'].includes(route.name)) return null

        const isFocused = state.index === index
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <Pressable
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabBarItem]}
            key={route.name}
          >
            {options.tabBarIcon &&
              options.tabBarIcon({
                size: 24,
                focused: isFocused,
                color: BrandColor.PrimaryColor[400],
              })}
            {!!options.tabBarLabel && (
              <Text
                style={[
                  styles.tabBarLabel,
                  { color: isFocused ? BrandColor.PrimaryColor[400] : BrandColor.Gray[400] },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
              >
                {label.toString()}
              </Text>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}
export default TabBar

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NeutralColor.White[50],
    gap: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: BrandColor.Gray[100],
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
})
