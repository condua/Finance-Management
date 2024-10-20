import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import { AntDesign } from '@expo/vector-icons'
import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { useLocale } from '@/src/hooks/useLocale'
import { useState, useMemo, useEffect } from 'react'
import categories from '@/src/constants/Categories'
import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import Input from '@/src/components/Input'
import { Category } from '@/src/types/enum'
import Button from '@/src/components/buttons/Button'
import { getImg } from '@/src/utils/getImgFromUri'
import {useUpdateCategoryMutation, useDeleteCategoryMutation} from '@/src/features/category/category.service'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '@/src/components/Loading'

const CategoryDetails = () => {
  const { t } = useLocale()
  const {bottom} = useSafeAreaInsets()
  const { category: id, icon, name, type } = useLocalSearchParams()
  const router = useRouter()
  const [editable, setEditable] = useState(false)
  const [category, setCategory] = useState<Partial<Category>>({
    name: '',
    icon: '',
  })
  const [showEdit, setShowEdit] = useState(true)
  const [updateCategory, {data ,isSuccess}] = useUpdateCategoryMutation()
  const [deleteCategory, {data: deletedCategory, isSuccess: isDeleted, isLoading: isLoadingDelete}] = useDeleteCategoryMutation()

  useEffect(() => {
    if (id && icon && name && type) {
      setCategory({
        name: name.toString(),
        icon: icon.toString(),
        type: type.toString() === 'income' ? 'income' : 'expense',
      })
    }
  }, [icon])
  useEffect(() => {
    if (data || deletedCategory) {
      router.back()
    }
  },[isSuccess, isDeleted])

  useMemo(() => {
    const category = categories.find((category) => category._id === id)
    if (category) {
      setShowEdit(false)
    }
  }, [])

  const onSelectIcon = () => {
    if (!editable) {
      return
    }
    router.push('/(authenticated)/(tabs)/account/icons')
  }

  const handleUpdateCategory = async () => {
    try {
      await updateCategory({
        id: id.toString(),
        body: {
          name: category.name,
          icon: category.icon,
        },
      }).unwrap()
    } catch (error) {
      console.log('error', error)
    }
    setEditable(false)
    setShowEdit(true)
  }

  const handleDeleteCategory = async () => {
    Alert.alert(t('actions.delete'), t('settings.deletecategorymessage'), [
      {
        text: t('actions.cancel'),
        style: 'cancel',
      },
      {
        text: t('actions.delete'),
        onPress: async () => await deleteCategory(id.toString()),
        style: 'destructive',
      },
    ])
 
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: name?.toString() ?? t('settings.category'),
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
              headerRight={() => {
                return (
                  showEdit && (
                    <HeaderButton
                      onPress={() => {
                        setEditable(true)
                        setShowEdit(false)
                      }}
                      type='btn'
                      button={() => (
                        <Image
                          source={require('@/src/assets/icons/edit.png')}
                          style={{ width: 24, height: 24, resizeMode: 'contain' }}
                        />
                      )}
                    />
                  )
                )
              }}
            />
          ),
        }}
      />
      <Loading isLoading={isLoadingDelete} text={t('Loading...')} />
      <View style={{ paddingVertical: 24, gap: 24 }}>
        <TouchableOpacity
          style={[styles.icon, { alignSelf: 'center' }]}
          onPress={onSelectIcon}
          disabled={!editable}
        >
          {category?.icon ? (
            <Image source={getImg(category.icon)} style={styles.img} />
          ) : (
            <Image source={require('@/src/assets/icons/smile.png')} style={styles.img} />
          )}
        </TouchableOpacity>
        <Input
          placeholder={t('analytics.categoryname')}
          value={category?.name}
          onChangeText={(text) => setCategory((prev) => ({ ...prev, name: text }))}
          validationOptions={{
            required: [true, 'Name is required'],
            minLength: [3, 'Name must be at least 3 characters'],
          }}
          editable={editable}
        />
      </View>
      {editable && (
        <View style={{ marginTop: 40, gap: 14 }}>
          <Button
            type={'primary'}
            text={t('actions.save')}
            size={'medium'}
            state={'normal'}
            onPress={handleUpdateCategory}
          />
        </View>
      )}
      {showEdit && (
        <Button
          text={t('actions.delete')}
          type='primary'
          size='large'
          state='normal'
          buttonLeft={() => (
            <Image
              source={require('@/src/assets/icons/recycle-bin.png')}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          )}
          onPress={handleDeleteCategory}
          style={{
            backgroundColor: BrandColor.Red[400],
            position: 'absolute',
            bottom: bottom + 24,
            alignSelf: 'center',
          }}
        />
      )}
    </View>
  )
}
export default CategoryDetails
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
