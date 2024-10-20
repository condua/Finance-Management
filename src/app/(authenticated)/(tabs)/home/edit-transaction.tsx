import { BackgroundColor, BrandColor, NeutralColor, TextColor } from '@/src/constants/Colors'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { CustomTab } from '@/src/app/(authenticated)/(tabs)/analytics/index'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from '@/src/hooks/useLocale'
import TabButtons, { TabButtonType } from '@/src/components/navigation/TabButtons'
import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import Input from '@/src/components/Input'
import { formatter } from '@/src/utils/formatAmount'
import formatDate from '@/src/utils/formatDate'
import { SafeAreaView } from 'react-native'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { ChevronDown } from 'react-native-feather'
import { ThemedText } from '@/src/components/ThemedText'
import { TextType } from '@/src/types/text'
import { Dimensions } from 'react-native'
import { getImg } from '@/src/utils/getImgFromUri'
import { useAppDispatch, useAppSelector } from '@/src/hooks/hooks'
import { useGetAllCategoriesQuery } from '@/src/features/category/category.service'
import Button from '@/src/components/buttons/Button'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Category, Transaction } from '@/src/types/enum'
import { AntDesign, Entypo, Fontisto } from '@expo/vector-icons'

import {
  useCreateTransactionMutation,
  useGetTransactionByIdQuery,
  useUpdateTransactionMutation,
} from '@/src/features/transaction/transaction.service'

import { Stack, useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router'

import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import Toast from 'react-native-toast-message'

import CurrencyInput from 'react-native-currency-input-fields'
import { clearTransaction } from '@/src/features/transaction/transactionSlice'
import Loading from '@/src/components/Loading'
import { usePrefetchImmediately } from '@/src/hooks/usePrefetchImmediately'
import { CommonActions, StackActions } from '@react-navigation/native'
import categoriesDefault from '@/src/constants/Categories'

type AndroidMode = 'date' | 'time'
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const initialTransaction: Omit<Transaction, '_id'> = {
  amount: 0,
  title: '',
  category: {} as Category,
  createdAt: new Date().toString(),
  type: 'expense',
}

const Page = () => {
  const { walletId } = useAppSelector((state) => state.auth)
  const {id} = useLocalSearchParams() as {id: string}
  const navigation = useNavigation()
  const { currencyCode, languageCode, languageTag } = useLocale()
  // const transactionState = useAppSelector((state) => state.transaction)
  const { img_url, title, createdAt, total } = useLocalSearchParams() as {
    img_url: string
    total: string
    title: string
    createdAt: string
  }
  const { bottom } = useSafeAreaInsets()
  const [selectedTab, setSelectedTab] = useState<CustomTab>(CustomTab.Tab1)
  const [transaction, setTransaction] = useState(initialTransaction)
  const [mode, setMode] = useState<AndroidMode>('date')
  const [show, setShow] = useState(false)
  const { t } = useLocale()
  const router = useRouter()
  const buttons: TabButtonType[] = [
    { title: t('transaction.expense') },
    { title: t('transaction.income') },
  ]
  const bottomSheetCategoryModalRef = useRef<BottomSheetModal>(null)
  const snapPointsCategory = useMemo(() => ['85%'], [])

  const {
    data: fetchedTransaction,
    isLoading: isLoadingFetched,
    refetch,
  } = useGetTransactionByIdQuery(
    {
      transactionId: id,
      walletId,
    },
    { skip: !id }
  )

  const [updateTransaction, updatedTransactionResult] = useUpdateTransactionMutation()
  const { data: categoriesRes } = useGetAllCategoriesQuery()

  const categoriesFilteredByType = useMemo(
    () =>
      categoriesRes?.filter((category) =>
        selectedTab === 1 ? category.type === 'income' : category.type === 'expense'
      ),
    [categoriesRes, selectedTab]
  )
  const renderBackdropCategoryModal = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.3}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior='collapse'
        onPress={() => bottomSheetCategoryModalRef.current?.dismiss()}
      />
    ),
    []
  )

  const showCategoryModal = async () => {
    bottomSheetCategoryModalRef.current?.present()
  }

  const chooseCategoryHandler = (category: Category) => {
    setTransaction((pre) => ({
      ...pre,
      category: {
        _id: category._id,
        name: category.name,
        icon: category.icon,
        type: category.type,
      },
    }))
    bottomSheetCategoryModalRef.current?.dismiss()
  }

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    const currentDate = date
    setShow(false)
    setTransaction((prev) => ({ ...prev, createdAt: currentDate!.toString() }))
  }

  const showMode = (currentMode: AndroidMode) => {
    setShow(true)
    setMode(currentMode)
  }
  const showDatepicker = () => {
    showMode('date')
  }

  const showTimepicker = () => {
    showMode('time')
  }

  useEffect(() => {
    if ( updatedTransactionResult.isSuccess) {
      setTransaction(initialTransaction)
      router.back()
    }
  }, [ updatedTransactionResult])

  useEffect(() => {
    if (img_url && title && createdAt && total) {
      setTransaction((pre) => ({
        ...pre,
        amount: Number(total),
        title: title,
        createdAt: createdAt,
      }))
    }
  }, [img_url, title, createdAt, total])

  useEffect(() => {
    if (fetchedTransaction) {
      setTransaction(fetchedTransaction)
      setSelectedTab(fetchedTransaction.type === 'income' ? 1 : 0)
    }
  }, [fetchedTransaction])

  const validateTransactionInfo = (transaction: Omit<Transaction, '_id'>) => {
    if (!transaction.amount) return { isValid: false, message: 'Amount is required' }
    if (!transaction.title) return { isValid: false, message: 'Title is required' }

    if (!transaction.category._id) return { isValid: false, message: 'Category is required' }
    if (transaction.amount <= 0) return { isValid: false, message: 'Amount must be greater than 0' }
    return { isValid: true, message: '' }
  }
  const handleSubmit = async () => {
    const { isValid, message } = validateTransactionInfo({
      amount: parseInt(transaction.amount.toString()),
      title: transaction.title,
      category: {
        _id: transaction.category._id,
        name: transaction.category.name,
        icon: transaction.category.icon,
        type: selectedTab === 1 ? 'income' : 'expense',
      },
      createdAt: transaction.createdAt.toString(),
      description: transaction.description,
      type: selectedTab === 1 ? 'income' : 'expense',
    })
    if (!isValid) return Toast.show({ type: 'error', text1: message })
    try {
      if (id) {
        await updateTransaction({
          id,
          updatedTransaction: {
            amount: parseInt(transaction.amount.toString()),
            title: transaction.title,
            category: transaction.category,
            createdAt: transaction.createdAt.toString(),
            description: transaction.description,
            type: selectedTab === 1 ? 'income' : 'expense',
          },
          walletId,
        }).unwrap()
      } 
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t('transaction.edittransaction'),
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  type='btn'
                  onPress={() => {
                    router.back()
                  }}
                  button={() => <AntDesign name='arrowleft' size={24} color={TextColor.Primary} />}
                />
              )}
              headerRight={() => (
                <HeaderButton
                  type='text'
                  onPress={() => router.navigate('/(authenticated)/(tabs)/home/camera')}
                  text={t('transaction.scan')}
                />
              )}
            />
          ),
        }}
      />
      <Loading isLoading={isLoadingFetched} text='Loading...' />
      <SafeAreaView style={styles.inner}>
        <View style={{ paddingVertical: 32, gap: 24 }}>
          <TabButtons buttons={buttons} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </View>
        <View style={{ gap: 8 }}>
          <View style={{ marginVertical: 12, marginBottom: 30 }}>
            <CurrencyInput
              placeholder='0'
              value={transaction.amount ? transaction.amount.toString() : ''}
              intlConfig={{ locale: 'de-DE', currency: currencyCode }}
              onValueChange={(text, values) => {
                setTransaction((prev) => ({
                  ...prev,
                  amount: Number(text),
                }))
              }}
              style={styles.currencyInput}
            />
          </View>

          <Input
            placeholder={t('transaction.addtitle')}
            value={transaction.title}
            buttonLeft={() => <Image source={require('@/src/assets/icons/note.png')} />}
            onChangeText={(text) => {
              setTransaction((pre) => {
                return { ...pre, title: text }
              })
            }}
            validationOptions={{
              required: [true, 'Title is required'],
            }}
          />
          <Pressable onPress={showCategoryModal} style={styles.button}>
            <Image
              source={
                transaction.category._id
                  ? getImg(transaction.category.icon)
                  : require('@/src/assets/icons/categories.png')
              }
              style={styles.iconCategory}
            />
            <View style={{ flex: 8 }}>
              <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                {transaction.category._id
                  ? categoriesDefault.includes(transaction.category.name)
                    ? t(`categories.${transaction.category.name}`)
                    : transaction.category.name
                  : t('transaction.categories')}
              </ThemedText>
            </View>
            <ChevronDown width={24} height={24} color={TextColor.Placeholder} />
          </Pressable>

          <SafeAreaView>
            <View style={{ position: 'absolute', left: 0, top: 4 }}></View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Pressable onPress={showDatepicker} style={[styles.button, { width: '48%' }]}>
                <Image
                  source={require('@/src/assets/icons/calendar.png')}
                  style={{ width: 24, height: 24, resizeMode: 'contain' }}
                />
                <View style={{ flex: 3 }}>
                  <Text adjustsFontSizeToFit={true} numberOfLines={1}>
                    {formatDate(new Date(transaction.createdAt), 'dd/mm/yy')}
                  </Text>
                </View>
                <ChevronDown width={24} height={24} color={TextColor.Placeholder} />
              </Pressable>
              <TouchableOpacity style={[styles.button, { width: '48%' }]} onPress={showTimepicker}>
                <Image
                  source={require('@/src/assets/icons/clock.png')}
                  style={{ width: 24, height: 24, resizeMode: 'contain' }}
                />
                <View style={{ flex: 3 }}>
                  <Text>{formatDate(new Date(transaction.createdAt), 'hh/mm')}</Text>
                </View>
                <ChevronDown width={24} height={24} color={TextColor.Placeholder} />
              </TouchableOpacity>
            </View>
            <View style={styles.datePicker}>
              {show && (
                <RNDateTimePicker
                  testID='dateTimePicker'
                  value={new Date(transaction.createdAt)}
                  mode={mode}
                  display='spinner'
                  is24Hour={true}
                  onChange={onChange}
                />
              )}
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
      <View style={{ marginBottom: bottom + 24 }}>
        <Button
          type={'primary'}
          text={id ? t('actions.update') : t('actions.save')}
          size={'large'}
          state={!transaction.title ? 'disabled' : 'normal'}
          disabled={!transaction.title}
          onPress={handleSubmit}
          isLoading={updatedTransactionResult.isLoading}
        />
      </View>

      <BottomSheetModal
        ref={bottomSheetCategoryModalRef}
        index={0}
        backdropComponent={renderBackdropCategoryModal}
        snapPoints={snapPointsCategory}
        handleComponent={null}
        enableOverDrag={false}
        enablePanDownToClose
      >
        <BottomSheetScrollView style={styles.bottomSheetModal}>
          <View style={styles.header}>
            <View style={styles.horizontalBar}></View>
            <ThemedText type={TextType.CalloutSemibold} color={TextColor.Primary}>
              {t('transaction.categories')}
            </ThemedText>
          </View>
          <View style={{ borderRadius: 14, marginTop: 24, overflow: 'hidden' }}>
            <ScrollView
              style={{
                width: screenWidth - 48,
                borderColor: BrandColor.Gray[100],
              }}
            >
              {categoriesFilteredByType?.map((category) => (
                <TouchableOpacity
                  key={category._id}
                  style={styles.item}
                  onPress={() => chooseCategoryHandler(category)}
                >
                  <View style={styles.iconCover}>
                    <Image source={getImg(category.icon)} style={styles.iconCategory} />
                  </View>
                  <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
                    {categoriesDefault.includes(category.name)
                      ? t(`categories.${category.name}`)
                      : category.name}
                  </ThemedText>
                  {/* { transaction.category._id === category._id && (  <View style={{position: 'absolute', right: 12}}>
                      <Image source={require('@/src/assets/icons/checked.png')} style={{width: 18, height: 18}} />
                    </View>)} */}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeutralColor.White[50],
    paddingHorizontal: 24,
  },
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
  bottomSheetModal: {
    width: screenWidth,
    paddingHorizontal: 24,
    borderStartStartRadius: 24,
    flex: 1,
  },
  header: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 12,
    borderBottomColor: NeutralColor.GrayLight[100],
    borderBottomWidth: 1,
  },
  horizontalBar: {
    width: '20%',
    height: 6,
    backgroundColor: NeutralColor.GrayLight[50],
    borderRadius: 18,
  },
  datePicker: {
    maxHeight: screenHeight * 0.15,
  },
  button: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    width: screenWidth - 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColor.Gray[300],
  },
  inner: {
    flex: 1,
  },
  currencyInput: {
    fontSize: 40,
    fontWeight: 'bold',
    color: TextColor.Primary,
    alignSelf: 'center',
    height: 60,
  },
})
