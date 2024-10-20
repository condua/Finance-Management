import { StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { ThemedText } from './ThemedText'
import { TextType } from '@/src/types/text'
import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'

interface AlertCustomProps {
  title: string
  text: string
  isVisible: boolean
  onCancel?: () => void
  onOk?: () => void
  onBackdropPress?: () => void
}

const AlertCustom = ({ title, text,isVisible,onBackdropPress, onCancel, onOk }: AlertCustomProps) => {
  return (
    <Modal style={styles.container} isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <View style={styles.title}>
        <ThemedText type={TextType.SubheadlineBold} color={TextColor.Primary}>
          {title}
        </ThemedText>
      </View>
      <View style={styles.divider} />
    </Modal>
  )
}
export default AlertCustom
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    borderRadius: 24,
    padding: 24,
    backgroundColor: BackgroundColor.LightTheme.Primary
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: BrandColor.Gray[200]
  }
})
