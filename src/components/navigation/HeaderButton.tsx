import { BrandColor } from '@/src/constants/Colors'
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import { ThemedText } from '../ThemedText'
import { TextType } from '@/src/types/text'

const BTN_SIZE = 38


type Button = {
  type: 'btn',
  button: () => React.ReactNode,
  onPress: () => void

}

type Text = {
  type: 'text'
  text: string,
  textColor?: string,
  onPress: () => void
}

type HeaderButtonProps = Button | Text


const HeaderButton = (props: HeaderButtonProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.headerBtn, props.type === 'btn' ? styles.circleBtn : undefined]}
    >
      {props.type === 'btn' ? (
        props.button()
      ) : (
        <ThemedText
          type={TextType.HeadlineBold}
          color={props.textColor ? props.textColor : BrandColor.PrimaryColor[400]}

          style={{ textTransform: 'capitalize', alignSelf: 'flex-start' }}
        >
          {props.text}
        </ThemedText>
      )}
    </TouchableOpacity>
  )
}
export default HeaderButton
const styles = StyleSheet.create({
  headerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE * 0.5,
    borderColor: BrandColor.Gray[100],
    borderWidth: 1,
  },
})

