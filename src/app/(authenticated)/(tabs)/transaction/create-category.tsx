import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@/src/hooks/useLocale'
import TabButtons, { TabButtonType } from '@/src/components/navigation/TabButtons'
import { TouchableOpacity } from 'react-native'
import Input from '@/src/components/Input'
import { Image } from 'react-native'
import Button from '@/src/components/buttons/Button'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Href, router, Stack } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { icons } from '@/src/constants/Icons'
import { useCreateCategoryMutation } from '@/src/features/category/category.service'
import { useAppSelector } from '@/src/hooks/hooks'
import { getImg } from '@/src/utils/getImgFromUri'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import { AntDesign } from '@expo/vector-icons'
import Header from '@/src/components/navigation/Header'

enum CustomTab {
  Tab1,
  Tab2,
}

const Page = () => {
  const { icon } = useLocalSearchParams()
  const [selectedTab, setSelectedTab] = useState<CustomTab>(CustomTab.Tab1)
  const [name, setName] = useState('')
  const { bottom } = useSafeAreaInsets()
  const { t } = useLocale()
  const { currencyCode } = useLocale()
  const [createCategory, { data, isSuccess, isError }] = useCreateCategoryMutation()

  const buttons: TabButtonType[] = [
    { title: t('analytics.expense') },
    { title: t('analytics.income') },
  ]

  useEffect(() => {
    if (data) {
      setName('')
      router.setParams({})

      router.back()
    }
  }, [isSuccess])

  const handleCreateCategory = async () => {
    try {
      await createCategory({
        name,
        icon: icon?.toString(),
        type: selectedTab === CustomTab.Tab1 ? 'expense' : 'income',
      })
    } catch (error) {
      console.log('error', error)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t('settings.createcategory'),
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  onPress={() => router.back()}
                  type='btn'
                  button={() => <AntDesign name='arrowleft' size={24} color={TextColor.Primary} />}
                />
              )}
            />
          ),
        }}
      />
      <View style={{ paddingVertical: 24, gap: 24 }}>
        <TabButtons buttons={buttons} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <TouchableOpacity
          style={[styles.icon, { alignSelf: 'center' }]}
          onPress={() => router.push('/(authenticated)/(tabs)/account/icons')}
        >
          <Image
            source={icon ? getImg(icon.toString()) : require('@/src/assets/icons/smile.png')}
            style={styles.img}
          />
        </TouchableOpacity>
        <Input
          placeholder={t('analytics.categoryname')}
          value={name}
          onChangeText={setName}
          validationOptions={{
            required: [true, 'Name is required'],
            minLength: [3, 'Name must be at least 3 characters'],
          }}
        />
      </View>
      <View style={{ marginTop: 40 }}>
        <Button
          type={'primary'}
          text={t('analytics.addcategories')}
          size={'medium'}
          state={'normal'}
          onPress={handleCreateCategory}
        />
      </View>
    </SafeAreaView>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    paddingHorizontal: 24,
  },
  icon: {
    width: 138,
    height: 138,
    borderRadius: 26,
    backgroundColor: BrandColor.PrimaryColor[50],
    borderColor: BrandColor.PrimaryColor[400],
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 54,
    height: 54,
    resizeMode: 'contain',
  },
})
