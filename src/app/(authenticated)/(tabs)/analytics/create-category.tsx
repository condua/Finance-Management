import { BackgroundColor, BrandColor } from '@/src/constants/Colors'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { CustomTab } from '.'
import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@/src/hooks/useLocale'
import TabButtons, { TabButtonType } from '@/src/components/navigation/TabButtons'
import { TouchableOpacity } from 'react-native'
import Input from '@/src/components/Input'
import { Image } from 'react-native'
import Button from '@/src/components/buttons/Button'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Href, router } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { icons } from '@/src/constants/Icons'
import { useCreateCategoryMutation } from '@/src/features/category/category.service'
import { useAppSelector } from '@/src/hooks/hooks'

const getImg = (icon: string) => {
  for (let i = 0; i < icons.length; i++) {
    if (icons[i].name === icon) {
      return icons[i].image
    }
  }
}

const Page = () => {
  const { icon } = useLocalSearchParams()
  const categoryImg = useMemo(() => getImg(icon?.toString()), [icon])
  const [selectedTab, setSelectedTab] = useState<CustomTab>(CustomTab.Tab1)
  const [name, setName] = useState('')
  const { bottom } = useSafeAreaInsets()
  const { t } = useLocale()
  const { currencyCode } = useLocale()
  const [createCategory, { data, isSuccess, isError }] = useCreateCategoryMutation()

  const buttons: TabButtonType[] = [
    { title: t('analytics.income') },
    { title: t('analytics.expense') },
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
        type: selectedTab === CustomTab.Tab1 ? 'income' : 'expense',
      })
    } catch (error) {
      console.log('error', error)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingVertical: 24, gap: 24 }}>
        <TabButtons buttons={buttons} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <TouchableOpacity
          style={[styles.icon, { alignSelf: 'center' }]}
          onPress={() => router.push('/(authenticated)/(tabs)/analytics/icons')}
        >
          <Image
            source={categoryImg ? categoryImg : require('@/src/assets/icons/smile.png')}
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
