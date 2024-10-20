import { ThemedText } from '@/src/components/ThemedText'
import { BackgroundColor, TextColor } from '@/src/constants/Colors'
import { useLocale } from '@/src/hooks/useLocale'
import { TextType } from '@/src/types/text'
import { DefaultTheme } from '@react-navigation/native'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const ICON_SIZE = 28

const Page = () => {
  const { t, languageCode, changeLanguage } = useLocale()
  return (
    <View style={styles.container}>
      {/* <Text>Page</Text> */}
      <ScrollView style={{ flex: 1 }}>
        <View style={[styles.form, { marginTop: 20 }]}>
          <TouchableOpacity style={styles.item} onPress={() => changeLanguage('en')}>
            <Image
              style={styles.imageIcon}
              source={require('@/src/assets/icons/united-kingdom.png')}
            />

            <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
              {t('settings.english')}
            </ThemedText>
            {languageCode === 'en' && (
              <View style={styles.right}>
                <Image source={require('@/src/assets/icons/checked.png')} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => changeLanguage('vi')}>
            <Image style={styles.imageIcon} source={require('@/src/assets/icons/vietnam.png')} />
            <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
              {t('settings.vietnamese')}
            </ThemedText>
            {languageCode === 'vi' && (
              <View style={styles.right}>
                <Image source={require('@/src/assets/icons/checked.png')} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    paddingHorizontal: 24,
  },
  form: {
    marginTop: 12,
    gap: 1,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: DefaultTheme.colors.background,
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 10,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    // backgroundColor: 'red'
  },
  imageIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: BackgroundColor.LightTheme.Secondary,
    resizeMode: 'contain',
  },
  right: {
    position: 'absolute',
    right: 0,
  },
})
