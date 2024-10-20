import { BackgroundColor } from '@/src/constants/Colors'
import { walletIcons } from '@/src/constants/Icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Page = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const onChooseIcon = (name: string) => {
    router.back()
    router.setParams({ icon: name })
  }
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, marginTop: 40 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {walletIcons.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.item, { width: '20%', height: 80, alignItems: 'center' }]}
              onPress={() => onChooseIcon(item.name)}
            >
              <Image source={item.image} resizeMode='contain' style={styles.img} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 24,
    backgroundColor: BackgroundColor.LightTheme.Primary,
  },

  item: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  img: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
})
