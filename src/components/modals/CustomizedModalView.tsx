import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { ThemedText } from '../ThemedText'
import { TextType } from '@/src/types/text'
import { NeutralColor, TextColor } from '@/src/constants/Colors'
import Button from '@/src/components/buttons/Button'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ReactElement } from 'react'

const screenWidth = Dimensions.get('window').width

type CustomizedModalViewProps = BottomSheetViewProps & {
  headerLabel: string
  buttonText: string
  headerLeft?: () => React.ReactNode
  onPress: () => void
}

const CustomizedModalView = ({
  headerLabel,
  buttonText,
  headerLeft,
  onPress,
  children,
}: CustomizedModalViewProps) => {
  const {bottom} = useSafeAreaInsets()

  return (
    <BottomSheetView style={styles.bottomSheetModal}>
      <View style={styles.header}>
        <View style={{position: 'absolute', 
          left: 0,
          top: 24,
        }}>{headerLeft && headerLeft()}</View>
        <View style={styles.horizontalBar}></View>
        <ThemedText type={TextType.CalloutSemibold} color={TextColor.Primary}>
          {headerLabel}
        </ThemedText>
      </View>
      <View style={{ width: '100%', alignItems: 'center', paddingHorizontal: 24, height: '85%' }}>
        {children}
      </View>
      <View style={{ position: 'absolute', bottom: bottom + 12 }}>
        <Button
          type={'primary'}
          text={buttonText}
          size={'medium'}
          state={'normal'}
          onPress={onPress}
        />
      </View>
    </BottomSheetView>
  )
}
export default CustomizedModalView
const styles = StyleSheet.create({
  bottomSheetModal: {
    width: screenWidth,
    paddingHorizontal: 24,
    borderStartStartRadius: 24,
    alignItems: 'center',
    flex: 1,
  },
  header: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 12,
    borderBottomColor: NeutralColor.GrayLight[100],
    borderBottomWidth: 1,

  },
  horizontalBar: {
    width: '20%',
    height: 6,
    backgroundColor: NeutralColor.GrayLight[50],
    borderRadius: 18,
  },
})
