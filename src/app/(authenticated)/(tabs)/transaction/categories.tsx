import { ThemedText } from '@/src/components/ThemedText'
import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { useAppDispatch, useAppSelector } from '@/src/hooks/hooks'
import { useLocale } from '@/src/hooks/useLocale'
import { TextType } from '@/src/types/text'
import { getImg } from '@/src/utils/getImgFromUri'
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Image, SafeAreaView, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import TabButtons, { TabButtonType } from '@/src/components/navigation/TabButtons'

import { Stack } from 'expo-router'
import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import { AntDesign } from '@expo/vector-icons'
import Loading from '@/src/components/Loading'
import { useGetAllCategoriesQuery } from '@/src/features/category/category.service'
import { Category } from '@/src/types/enum'
import  categoriesDefault from '@/src/constants/Categories'


 enum CustomTab {
  Tab1,
  Tab2,
}

const history = () => {
  const router = useRouter()
  const { t } = useLocale()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const { choose, id } = useLocalSearchParams()
  const { isLoading, data: categories, isError } = useGetAllCategoriesQuery()
  const [selectedTab, setSelectedTab] = useState<CustomTab>(CustomTab.Tab1)
  const buttons: TabButtonType[] = [
    { title: t('transaction.expense') },
    { title: t('transaction.income') },
  ]


 
  const categoriesFilteredByType = useMemo(
    () =>
      categories?.filter((category) =>
        selectedTab === 0 ? category.type === 'expense' : category.type === 'income'
      ),
    [categories, selectedTab]
  )

  const chooseCategory = (category: Category) => {
      router.navigate({
        pathname: `/(authenticated)/(tabs)/transaction?categoryId=${category._id}&icon=${category.icon}&name=${category.name}&type=${category.type}&transactionId=${id}`,
      })
  }




  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 24,
        backgroundColor: BackgroundColor.LightTheme.Primary,
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          headerTitle: t('settings.categories'),
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
              headerRight={() => (
                <HeaderButton
                  onPress={() => router.push('/(authenticated)/(tabs)/transaction/create-category')}
                  type='text'
                  text={t('actions.add')}
                />
              )}
            />
          ),
        }}
      />
      {<Loading isLoading={isLoading} text='Loading..' />}
      <View style={{ paddingVertical: 24, gap: 24 }}>
        <TabButtons buttons={buttons} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {categoriesFilteredByType?.map((category) => (
          <TouchableOpacity
            key={category._id}
            style={styles.item}
            onPress={() => chooseCategory(category)}
          >
            <View style={styles.iconCover}>
              <Image source={getImg(category.icon)} style={styles.iconCategory} />
            </View>
            <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
              { categoriesDefault.includes(category.icon) ? t(`categories.${category.icon}`):category.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }}></View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default history
const styles = StyleSheet.create({
  item: {
    width: '100%',
    backgroundColor: BrandColor.Gray[50],
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomColor: BrandColor.Gray[100],
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCover: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColor.Gray[200],
    backgroundColor: BackgroundColor.LightTheme.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCategory: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
})
