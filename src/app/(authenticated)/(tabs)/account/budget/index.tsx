import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import { ThemedText } from '@/src/components/ThemedText'
import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { useLocale } from '@/src/hooks/useLocale'
import { AntDesign } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { formatDistanceToNowStrict } from 'date-fns'
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { useCreatePlanMutation, useGetAllPlansQuery } from '@/src/features/plan/plan.service'
import { useAppSelector } from '@/src/hooks/hooks'
import { TextType } from '@/src/types/text'
import { useCallback, useMemo, useRef, useState } from 'react'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'

import { formatter } from '@/src/utils/formatAmount'
import { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Sliders } from 'react-native-feather'

import Button from '@/src/components/buttons/Button'
import { getImg } from '@/src/utils/getImgFromUri'
import Loading from '@/src/components/Loading'
import { abbrValueFormat } from '@/src/utils/abbrValueFormat'
import { formatValue } from 'react-native-currency-input-fields'
import { getCurrencySymbol } from '@/src/utils/getCurrencySymbol'
import { useSettings } from '@/src/hooks/useSetting'
type AndroidMode = 'date' | 'time'

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const Page = () => {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const { currencyCode } = useLocale()
  const { decimalSeparator, groupSeparator, disableDecimal, showCurrency, shortenAmount } =
    useSettings().styleMoneyLabel
  const { t } = useLocale()
  const { walletId } = useAppSelector((state) => state.auth)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [desiredDate, setDesiredDate] = useState(new Date().toString())
  const [mode, setMode] = useState<AndroidMode>('date')
  const [show, setShow] = useState(false)
  const { data, isFetching } = useGetAllPlansQuery({
    walletId,
    type: 'budget',
  })



  const [createPlan, { data: createPlanResponse, isSuccess }] = useCreatePlanMutation()

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => ['96%'], [])
  // sort end_date desc
  const budgets = useMemo(() => {
    if(!data) return []
    const newData = [...data]
    return newData.sort((pre, cur) => {
      if (pre.end_date > cur.end_date) return -1 
      else if (pre.end_date < cur.end_date) return 1
      return 0
    })
  }, [data])

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.3}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior='collapse'
        onPress={() => bottomSheetModalRef.current?.dismiss()}
      />
    ),
    []
  )

  const showModal = async () => {
    bottomSheetModalRef.current?.present()
  }

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    const currentDate = date
    setShow(false)
    setDesiredDate(currentDate!.toString())
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

  const handleCreatePlan = async () => {
    try {
      await createPlan({
        walletId,
        body: {
          type: 'goal',
          name: title,
          end_date: new Date(desiredDate).toString(),
          attributes: {
            target_amount: parseInt(amount.replace(/,/g, '')),
            current_amount: 0,
            records: [],
          },
        },
      }).unwrap()
      setTitle('')
      setAmount('')
      setDesiredDate(new Date().toString())
    } catch (error) {
      console.log('🚀 ~ handleCreatePlan ~ error:', error)
    }
    bottomSheetModalRef.current?.dismiss()
  }
  // const budgets = data?.metadata || []
  if (isFetching)
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: t('budgets.runningbudgets'),
            header: (props) => (
              <Header
                {...props}
 
              />
            ),
          }}
        />
        <Loading isLoading={isFetching} text='Loading..' />
      </View>
    )
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t('budgets.runningbudgets'),
          header: (props) => (
            <Header
              {...props}
              // headerRight={() => (
              //   <HeaderButton
              //     type='btn'
              //     onPress={() => console.log('show action sheet')}
              //     button={() => (
              //       <Sliders width={24} height={24} color={BrandColor.PrimaryColor[400]} />
              //     )}
              //   />
              // )}
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
      {budgets?.length === 0 && (
        <View
          style={{
            marginTop: 100,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <ThemedText
            type={TextType.FootnoteRegular}
            color={TextColor.Primary}
            style={{ textAlign: 'center', marginTop: 100 }}
          >
            {t('budgets.youhavenobudgets')}
          </ThemedText>
          <ThemedText
            type={TextType.FootnoteRegular}
            color={TextColor.Secondary}
            style={{ textAlign: 'center', marginTop: 12 }}
            numberOfLines={2}
          >
            {t('budgets.description')}
          </ThemedText>
        </View>
      )}
      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollView}>
          {budgets?.map((budget: any, index: number) => {
            const { attributes } = budget

            return (
              <TouchableOpacity
                key={budget._id}
                style={[styles.item, new Date(budget.end_date) <= new Date() ? {backgroundColor: BrandColor.Gray[300]} : {}]}
                onPress={() =>
                  router.push({
                    pathname: '/(authenticated)/(tabs)/account/budget/[id]',
                    params: { id: budget._id },
                  })
                }
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    <View style={styles.imgCover}>
                      <Image
                        source={getImg(attributes.categories[0].icon)}
                        style={{ width: 24, height: 24, resizeMode: 'contain' }}
                      />
                    </View>
                    <View>
                      <ThemedText type={TextType.SubheadlineSemibold} color={TextColor.Primary}>
                        {budget.name}
                      </ThemedText>
                      <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                        {attributes.categories.map((category: any) => category.name).length > 2
                          ? attributes.categories
                              .map((category: any) => category.name)
                              .join(', ')
                              .slice(0, 20) + '...'
                          : attributes.categories.map((category: any) => category.name).join(', ')}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <ThemedText type={TextType.SubheadlineSemibold} color={TextColor.Primary}>
                      {shortenAmount
                        ? abbrValueFormat(
                            Number(budget.attributes.target_amount),
                            showCurrency,
                            currencyCode
                          )
                        : formatValue({
                            value: String(budget.attributes.target_amount),
                            decimalSeparator: decimalSeparator,
                            groupSeparator: groupSeparator,
                            suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
                            decimalScale: disableDecimal ? 0 : 2,
                          })}
                    </ThemedText>
                    <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                      {attributes.target_amount - attributes.spent_amount > 0
                        ? `${t('budgets.left')} ${
                            shortenAmount
                              ? abbrValueFormat(
                                  Number(attributes.target_amount - attributes.spent_amount),
                                  showCurrency,
                                  currencyCode
                                )
                              : formatValue({
                                  value: String(attributes.target_amount - attributes.spent_amount),
                                  decimalSeparator: decimalSeparator,
                                  groupSeparator: groupSeparator,
                                  suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
                                  decimalScale: disableDecimal ? 0 : 2,
                                })
                          }`
                        : `${t('budgets.overspent')} ${
                            shortenAmount
                              ? abbrValueFormat(
                                  Number(-(attributes.target_amount - attributes.spent_amount)),
                                  showCurrency,
                                  currencyCode
                                )
                              : formatValue({
                                  value: String(
                                    -(attributes.target_amount - attributes.spent_amount)
                                  ),
                                  decimalSeparator: decimalSeparator,
                                  groupSeparator: groupSeparator,
                                  suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
                                  decimalScale: disableDecimal ? 0 : 2,
                                })
                          }`}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.outer}>
                  <View
                    style={[
                      styles.inner,
                      {
                        width: `${
                          Math.round(
                            ((budget.attributes.spent_amount || 0) * 100) /
                              (budget.attributes.target_amount || 1)
                          ) >= 100
                            ? 100
                            : Math.round(
                                (budget.attributes.spent_amount * 100) /
                                  budget.attributes.target_amount
                              )
                        }%`,
                      },
                      attributes.spent_amount - attributes.target_amount < 0
                        ? { backgroundColor: BrandColor.PrimaryColor[400] }
                        : { backgroundColor: BrandColor.Red[400] },
                    ]}
                  />
                </View>
                <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                  {new Date(budget.end_date) > new Date()
                    ? `${formatDistanceToNowStrict(new Date(budget.end_date))} left `
                    : 'Expired'}
                </ThemedText>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={{ height: 100 }}></View>
      </ScrollView>
      <View style={styles.bottom}>
        <Button
          style={{ marginTop: 24 }}
          onPress={() => router.push('/(authenticated)/(tabs)/account/budget/create-budget')}
          text={t('budgets.createbudget')}
          type='primary'
          state='normal'
          size='large'
        />
      </View>
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    // backgroundColor: BackgroundColor.LightTheme.Primary,
    flex: 1,
  },
  totalBalance: {
    minWidth: 102,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: BrandColor.Gray[200],
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
  scrollView: {
    marginTop: 12,
    width: screenWidth - 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    flex: 1,
  },
  item: {
    width: '100%',
    height: 150,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    borderRadius: 14,
    marginVertical: 12,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: '50%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  goalCard: {
    gap: 6,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: screenWidth - 48,
    height: 200,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColor.Gray[300],
  },
  amountText: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.4,
    color: TextColor.Primary,
    textAlign: 'center',
  },
  outer: {
    backgroundColor: BrandColor.Gray[50],
    height: 14,
    width: '100%',
    borderRadius: 14,
  },
  inner: {
    backgroundColor: BrandColor.PrimaryColor[400],
    height: 14,
    borderRadius: 14,
  },
  imgCover: {
    width: 33,
    height: 33,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColor.Gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 16,
    backgroundColor: BackgroundColor.LightTheme.Primary,
  },
})
