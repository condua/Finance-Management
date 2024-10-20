import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ThemedText } from '../ThemedText'
import { TextType } from '../../types/text'
import { BrandColor, NeutralColor, TextColor } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useLocale } from '../../hooks/useLocale'
import { useRouter } from 'expo-router'
import { Plus } from 'react-native-feather'

export type InfoButtonProps = {
  title: string
  description: string
  icon: () => React.ReactElement
  buttonRight?: () => React.ReactElement
  onPress: () => void
}

const InfoButton = ({ title, description, icon, buttonRight, onPress }: InfoButtonProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCover}>{icon()}</View>
      <View style={{ gap: 4 }}>
        <ThemedText type={TextType.SubheadlineSemibold} color={TextColor.Primary}>
          {title}
        </ThemedText>
        <ThemedText type={TextType.Caption11Regular} color={NeutralColor.Black[300]}>
          {description}
        </ThemedText>
      </View>
      {buttonRight && <TouchableOpacity style={styles.rightBtn} onPress={onPress}>
        {  buttonRight()}
      </TouchableOpacity>}
    </View>
  )
}
export default InfoButton
const styles = StyleSheet.create({
  container: {
    minHeight: 66,
    width: '100%',
    gap: 10,
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColor.Gray[100],
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  iconCover: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: BrandColor.PrimaryColor[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightBtn: {
    backgroundColor: BrandColor.PrimaryColor[100],
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
