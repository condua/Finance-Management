import { BackgroundColor, BrandColor, NeutralColor, TextColor } from '@/src/constants/Colors'
import {
  Alert,
  AnimatableStringValue,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  startOfWeek,
  endOfWeek,
  format,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  set,
} from 'date-fns'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from '@/src/hooks/useLocale'
import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import Input from '@/src/components/Input'
import MaskInput from 'react-native-mask-input'
import { formatter } from '@/src/utils/formatAmount'
import formatDate from '@/src/utils/formatDate'
import { SafeAreaView } from 'react-native'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { ChevronDown, ChevronRight, Plus, X } from 'react-native-feather'
import { ThemedText } from '@/src/components/ThemedText'
import { TextType } from '@/src/types/text'
import { Dimensions } from 'react-native'
import { getImg } from '@/src/utils/getImgFromUri'
import { useAppDispatch, useAppSelector } from '@/src/hooks/hooks'
import { useGetAllCategoriesQuery } from '@/src/features/category/category.service'
import Button from '@/src/components/buttons/Button'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Budget, Category, FinancialPlan, Transaction } from '@/src/types/enum'
import { AntDesign, Entypo, Fontisto } from '@expo/vector-icons'
import {
  useCreatePlanMutation,
  useGetPlanByIdQuery,
  useUpdatePlanMutation,
} from '@/src/features/plan/plan.service'

import {
  Href,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
  useSegments,
} from 'expo-router'

import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'

import { useActionSheet } from '@expo/react-native-action-sheet'
import CurrencyInput from 'react-native-currency-input-fields'
import { validations } from '@/src/utils/validations'
import { skipToken } from '@reduxjs/toolkit/query'
import categoriesDefault from '@/src/constants/Categories'
import dayjs, { Dayjs } from 'dayjs'
import DateTimePicker from 'react-native-ui-datepicker'
import Modal from 'react-native-modal'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const initialBudget: Omit<FinancialPlan, '_id'> = {
  name: '',
  type: 'budget',
  end_date: new Date().toString(),
  attributes: {
    target_amount: 0,
    categories: [] as Category[],
  } as Budget,
}

const getPeriods = () => {
  const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
  const endWeek = endOfWeek(new Date(), { weekStartsOn: 1 })

  // Format the dates as needed (optional)
  const formattedStartWeek = format(startWeek, 'dd/MM')
  const formattedEndWeek = format(endWeek, 'dd/MM')

  const startMonth = startOfMonth(new Date())
  const endMonth = endOfMonth(new Date())

  const startQuarter = startOfQuarter(new Date())
  const endQuarter = endOfQuarter(new Date())

  const startYear = startOfYear(new Date())
  const endYear = endOfYear(new Date())

  const formattedStartMonth = format(startMonth, 'dd/MM')
  const formattedEndMonth = format(endMonth, 'dd/MM')

  const formattedStartQuarter = format(startQuarter, 'dd/MM')
  const formattedEndQuarter = format(endQuarter, 'dd/MM')

  const formattedStartYear = format(startYear, 'dd/MM')
  const formattedEndYear = format(endYear, 'dd/MM')

  return {
    options: [
      `This week (${formattedStartWeek} - ${formattedEndWeek})`,
      `This month (${formattedStartMonth} - ${formattedEndMonth})`,
      `This quarter (${formattedStartQuarter} - ${formattedEndQuarter})`,
      `This year (${formattedStartYear} - ${formattedEndYear})`,
    ],
    values: [
      [startWeek, endWeek],
      [startMonth, endMonth],
      [startQuarter, endQuarter],
      [startYear, endYear],
    ],
  }
}

const Page = () => {
  const { walletId } = useAppSelector((state) => state.auth)
  const { showActionSheetWithOptions } = useActionSheet()
  const { id } = useLocalSearchParams() as { id: string }
  const [isValid, setIsValid] = useState({
    title: false,
    target_amount: false,
    categories: false,
    period: false,
  })

  const [indexOptions, setIndexOptions] = useState<number | undefined>()
  const { bottom } = useSafeAreaInsets()
  const [budget, setBudget] = useState(initialBudget)
  const [showCalendar, setShowCalendar] = useState(false)
  const [customPeriod, setCustomPeriod] = useState<
    | {
        startDate: Dayjs
        endDate: Dayjs
      }
    | undefined
  >({
    startDate: dayjs(),
    endDate: dayjs(),
  })
  const { t } = useLocale()
  const router = useRouter()
  const { currencyCode } = useLocale()

  const bottomSheetCategoryModalRef = useRef<BottomSheetModal>(null)
  const snapPointsCategory = useMemo(() => ['85%'], [])

  const { data: categoriesRes } = useGetAllCategoriesQuery()
  const [udpateBudget, updateBudgetResult] = useUpdatePlanMutation()
  const { data: fetchedBudget } = useGetPlanByIdQuery({
    walletId,
    planId: id ?? skipToken,
  })

  const categoriesFilteredByType = useMemo(
    () => categoriesRes?.filter((category) => category.type === 'expense'),
    [categoriesRes]
  )

  const selectedCategoryIds =
    useMemo(() => {
      return (budget.attributes as Budget).categories.map((category) => category._id)
    }, [budget]) || []

  const { options, values } = useMemo(() => {
    const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
    const endWeek = endOfWeek(new Date(), { weekStartsOn: 1 })

    // Format the dates as needed (optional)
    const formattedStartWeek = format(startWeek, 'dd/MM')
    const formattedEndWeek = format(endWeek, 'dd/MM')

    const startMonth = startOfMonth(new Date())
    const endMonth = endOfMonth(new Date())

    const startQuarter = startOfQuarter(new Date())
    const endQuarter = endOfQuarter(new Date())

    const startYear = startOfYear(new Date())
    const endYear = endOfYear(new Date())

    const formattedStartMonth = format(startMonth, 'dd/MM')
    const formattedEndMonth = format(endMonth, 'dd/MM')

    const formattedStartQuarter = format(startQuarter, 'dd/MM')
    const formattedEndQuarter = format(endQuarter, 'dd/MM')

    const formattedStartYear = format(startYear, 'dd/MM')
    const formattedEndYear = format(endYear, 'dd/MM')

    return {
      options: [
        `${t('period.thisweek')} (${formattedStartWeek} - ${formattedEndWeek})`,
        `${t('period.thismonth')} (${formattedStartMonth} - ${formattedEndMonth})`,
        `${t('period.thisquarter')} (${formattedStartQuarter} - ${formattedEndQuarter})`,
        `${t('period.thisyear')} (${formattedStartYear} - ${formattedEndYear})`,
        `${t('period.custom')} (${format(
          customPeriod?.startDate.toString() ?? new Date().toString(),
          'dd/MM'
        )} - ${format(customPeriod?.endDate?.toString() ?? new Date().toString(), 'dd/MM')})`,
      ],
      values: [
        [startWeek, endWeek],
        [startMonth, endMonth],
        [startQuarter, endQuarter],
        [startYear, endYear],
        [customPeriod?.startDate, customPeriod?.endDate],
      ],
    }
  }, [customPeriod]) || [
    t('period.thisweek'),
    t('period.thismonth'),
    t('period.thisquarter'),
    t('period.thisyear'),
    t('period.custom'),
    'Cancel',
  ]
  const period = useMemo(() => {
    const { end_date } = fetchedBudget
    const { start_date } = fetchedBudget?.attributes
  }, [fetchedBudget])

  useEffect(() => {
    if (updateBudgetResult.isSuccess) {
      router.back()
    }
    if (fetchedBudget) {
      setBudget({
        ...fetchedBudget,
        attributes: {
          ...fetchedBudget.attributes,
          categories: fetchedBudget.attributes.categories,
        },
      })
    }
  }, [updateBudgetResult, fetchedBudget])

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
    setBudget((pre) => ({
      ...pre,
      attributes: {
        ...pre.attributes,
        categories: [category],
      },
    }))
    bottomSheetCategoryModalRef.current?.dismiss()
  }

  const selectCategory = (category: Category) => {
    setBudget((prev) => {
      if (selectedCategoryIds.includes(category._id)) {
        return {
          ...prev,
          attributes: {
            ...prev.attributes,
            categories: (prev.attributes as Budget).categories.filter(
              (cat) => cat._id !== category._id
            ),
          },
        }
      } else {
        return {
          ...prev,
          attributes: {
            ...prev.attributes,
            categories: [...(prev.attributes as Budget).categories, category],
          },
        }
      }
    })
  }

  const openActionSheet = async () => {
    const cancelButtonIndex = 4
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: t('budgets.selecttimerange'),
      },
      (selectedIndex: any) => {
        if (selectedIndex >= options.length) return

        if (selectedIndex === 4) {
          setShowCalendar(true)
        }
        setIndexOptions(selectedIndex)
      }
    )
  }

  const handleUpdateBudget = async () => {
    //validate
    const { isValid, message } = validations([
      {
        field: 'title',
        value: budget.name,
        validations: { required: [true, 'Title is required'] },
      },
      {
        field: 'target_amount',
        value: budget.attributes.target_amount.toString(),
        validations: { required: [true, 'Target amount is required'] },
      },
      {
        field: 'categories',
        value: (budget.attributes as Budget).categories.length.toString(),
        validations: { required: [true, 'Category is required'] },
      },
    ])

    if (!isValid) {
      Alert.alert('Error', message)
      return
    }
    try {
      await udpateBudget({
        walletId,
        planId: id,
        type: 'budget',
        body: {
          ...budget,
          end_date:
            indexOptions !== undefined
              ? values[indexOptions][1].toString()
              : fetchedBudget?.end_date,
          attributes: {
            target_amount: Number(budget.attributes.target_amount),
            categories: (budget.attributes as Budget).categories.map((category) => category._id),
            start_date:
              indexOptions !== undefined
                ? values[indexOptions][0].toString()
                : fetchedBudget.attributes.start_date,
          },
        },
      }).unwrap()
    } catch (error) {
      console.log('🚀 ~ handleUpdateBudget ~ error', error)
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t('budgets.newbudget'),
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  type='btn'
                  onPress={() => router.back()}
                  button={() => <AntDesign name='arrowleft' size={24} color={TextColor.Primary} />}
                />
              )}
            />
          ),
        }}
      />
      <SafeAreaView style={styles.inner}>
        <Modal
          style={styles.modal}
          isVisible={showCalendar}
          onBackdropPress={() => setShowCalendar(false)}
        >
          <View style={{ alignItems: 'flex-end', padding: 12 }}>
            <Pressable
              style={{ justifyContent: 'center', alignItems: 'center' }}
              onPress={() => setShowCalendar(false)}
            >
              <X width={24} height={24} color={TextColor.Primary} />
            </Pressable>
          </View>
          <DateTimePicker
            height={300}
            mode='range'
            timePicker={true}
            startDate={customPeriod?.startDate}
            endDate={customPeriod?.endDate}
            onChange={({ startDate, endDate }) => {
              setCustomPeriod({
                startDate,
                endDate,
              })
            }}
          />
        </Modal>
        <View style={{ paddingVertical: 32, gap: 24 }}>
          <View
            style={{
              margin: 'auto',
              borderRadius: 24,
              borderColor: BrandColor.Gray[200],
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Secondary}>
              {t('budgets.targetamount')}
            </ThemedText>
          </View>
        </View>
        <View style={{ gap: 14 }}>
          <View style={{ marginVertical: 12, marginBottom: 30 }}>
            <CurrencyInput
              placeholder='0'
              value={
                budget.attributes.target_amount ? budget.attributes.target_amount.toString() : ''
              }
              intlConfig={{ locale: 'de-DE', currency: currencyCode }}
              onValueChange={(text, values) => {
                setBudget((prev) => ({
                  ...prev,
                  attributes: {
                    ...prev.attributes,
                    target_amount: Number(text),
                  },
                }))
              }}
              style={styles.currencyInput}
            />
          </View>
          <Input
            placeholder={t('transaction.addtitle')}
            value={budget.name}
            buttonLeft={() => <Image source={require('@/src/assets/icons/note.png')} />}
            onChangeText={(text) => {
              setBudget((pre) => {
                return { ...pre, name: text }
              })
            }}
            validationOptions={{
              required: [true, 'Title is required'],
            }}
            validate={(isValid) => setIsValid((prev) => ({ ...prev, title: isValid }))}
          />
          <Pressable onPress={showCategoryModal} style={styles.button}>
            <Image
              source={
                budget.attributes.categories?.length > 0
                  ? getImg(budget.attributes.categories[0].icon)
                  : require('@/src/assets/icons/grid2.png')
              }
              style={styles.iconCategory}
            />
            <View style={{ flex: 8 }}>
              <ThemedText type={TextType.FootnoteRegular} color={TextColor.Primary}>
                {budget.attributes.categories?.length > 0
                  ? budget.attributes.categories?.length === 1
                    ? categoriesDefault.includes(budget.attributes.categories[0].icon)
                      ? t(`categories.${budget.attributes.categories[0].icon}`)
                      : budget.attributes.categories[0].name
                    : categoriesDefault.includes(budget.attributes.categories[0].icon)
                    ? `${t(`categories.${budget.attributes.categories[0].icon}`)} & more`
                    : `${budget.attributes.categories[0].name} & more`
                  : t('budgets.selectcategory')}
              </ThemedText>
            </View>
            <ChevronRight width={24} height={24} color={TextColor.Placeholder} />
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
              <Pressable onPress={openActionSheet} style={[styles.button, { width: '100%' }]}>
                <Fontisto name='date' size={20} color={BrandColor.PrimaryColor[400]} />
                <View style={{ flex: 3 }}>
                  {indexOptions !== undefined ? (
                    <Text>{options[indexOptions]}</Text>
                  ) : (
                    <ThemedText
                      type={TextType.FootnoteSemibold}
                      color={TextColor.Primary}
                      adjustsFontSizeToFit={false}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {`${formatDate(
                        fetchedBudget?.attributes.start_date
                          ? new Date(fetchedBudget?.attributes.start_date)
                          : new Date(),
                        'dd/mm/yy'
                      )} -  ${formatDate(
                        fetchedBudget?.end_date ? new Date(fetchedBudget?.end_date) : new Date(),
                        'dd/mm/yy'
                      )} `}
                    </ThemedText>
                  )}
                </View>
                <ChevronRight width={24} height={24} color={TextColor.Placeholder} />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
      <View style={{ marginBottom: bottom + 24 }}>
        <Button
          type={'primary'}
          text={id ? t('actions.update') : t('actions.create')}
          size={'large'}
          state={'normal'}
          onPress={handleUpdateBudget}
          isLoading={updateBudgetResult.isLoading}
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
                    {categoriesDefault.includes(category.icon)
                      ? t(`categories.${category.icon}`)
                      : category.name}
                  </ThemedText>
                  <View style={{ position: 'absolute', right: 12 }}>
                    <TouchableOpacity onPress={() => selectCategory(category)}>
                      {selectedCategoryIds.includes(category._id) ? (
                        <Image
                          source={require('@/src/assets/icons/checked.png')}
                          style={{ width: 24, height: 24 }}
                        />
                      ) : (
                        <Image
                          source={require('@/src/assets/icons/circle_plus2.png')}
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
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
  modal: {
    maxHeight: 400,
    backgroundColor: '#F5FCFF',
    borderRadius: 12,
    padding: 12,
    margin: 'auto',
    marginHorizontal: 24,
  },
})
