import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types'
import { Dimensions, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import { ThemedText } from '../ThemedText'
import { TextType } from '@/src/types/text'
import { NeutralColor, TextColor } from '@/src/constants/Colors'
import Button from '@/src/components/buttons/Button'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Platform } from 'react-native'

const screenWidth = Dimensions.get('window').width

type CustomizedModalScrollViewProps = BottomSheetViewProps & {
  headerLabel: string
  buttonText: string
  isLoading: boolean
  onPress: () => void
}

const CustomizedModalScrollView = ({
  headerLabel,
  buttonText,
  onPress,
  children,
  isLoading
}: CustomizedModalScrollViewProps) => {
  const { bottom } = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 70}
    >
      <BottomSheetScrollView style={{ flex: 1 }}>
        <BottomSheetView style={styles.bottomSheetModal}>
          <View style={styles.header}>
            <View style={styles.horizontalBar}></View>
            <ThemedText type={TextType.CalloutSemibold} color={TextColor.Primary}>
              {headerLabel}
            </ThemedText>
          </View>
          <View
            style={{ width: '100%', alignItems: 'center', paddingHorizontal: 24, height: '85%' }}
          >
            {children}
          </View>
        </BottomSheetView>
      </BottomSheetScrollView>
      <View style={{ position: 'absolute', bottom: bottom + 12, left: 24 }}>
        <Button
          type={'primary'}
          text={buttonText}
          size={'medium'}
          state={'normal'}
          isLoading={isLoading}
          onPress={onPress}
        />
      </View>
    </KeyboardAvoidingView>
  )
}
export default CustomizedModalScrollView
const styles = StyleSheet.create({
  bottomSheetModal: {
    width: screenWidth,
    paddingHorizontal: 24,
    borderStartStartRadius: 24,
    alignItems: 'center',
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
