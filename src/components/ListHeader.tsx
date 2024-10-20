import { StyleSheet, Text, View } from 'react-native'
import { ThemedText } from './ThemedText'
import { TextType } from '../types/text'
import { TextColor } from '../constants/Colors'
import {memo} from 'react'
interface ListHeaderProps {
 title:string
 rightComponent?: React.ReactNode
}


const ListHeader = ({ title, rightComponent }: ListHeaderProps) => {
  return (
    <View style={styles.container}>
      <ThemedText type={TextType.CalloutSemibold} color={TextColor.Primary}>
        {title}
      </ThemedText>
      <View style={styles.right}>{rightComponent}</View>
    </View>
  )
}
export default memo(ListHeader)
const styles = StyleSheet.create({
 container: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 8,
 },
 right: {

 }
})