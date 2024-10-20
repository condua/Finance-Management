import { Pressable, StyleSheet, Text, View } from 'react-native'
import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import {type NativeStackHeaderProps} from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign'
import { BackgroundColor, BrandColor, NeutralColor, TextColor } from '@/src/constants/Colors'
import { ThemedText } from '../ThemedText'
import { TextType } from '@/src/types/text'
import { StatusBar } from 'expo-status-bar'
import { ReactElement } from 'react'

type HeaderProps =
  (| BottomTabHeaderProps
  | NativeStackHeaderProps) & {
      headerLeft?: () => React.ReactNode
      headerRight?: () => React.ReactNode
    }

const BTN_SIZE = 38

const Header = ({ options, route, headerLeft, headerRight }: HeaderProps) => {
  const { top } = useSafeAreaInsets()
  const { headerTitle } = options
  return (
    <View style={[styles.headerContainer, { marginTop: top }]}>
      <StatusBar style='dark' backgroundColor={'rgba(255, 255, 255, 0.85)'}  />
      <View style={{ flex: 1 }}>{!!headerLeft && headerLeft()}</View>
      <View style={{ flex: 2 }}>
        <ThemedText
          type={TextType.HeadlineBold}
          color={TextColor.Primary}
          style={{ alignSelf: 'center' }}
        >
          {headerTitle?.toString()}
        </ThemedText>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>{!!headerRight && headerRight()}</View>
    </View>
  )
}

export default Header
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    borderStartStartRadius: 12,
    borderStartColor: BrandColor.Gray[100],
    borderStartWidth: 2,
    opacity: 0.85,
    height: 68,
    borderBottomWidth: 1,
    borderColor: NeutralColor.GrayMedium[50],
  },
  headerTitle: {
    fontSize: 17,
  },
  headerLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerRightText: {
    color: BrandColor.PrimaryColor[400],
  },
})
