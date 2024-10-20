import { ThemedText } from '@/src/components/ThemedText'
import TransactionItem from '@/src/components/TransactionItem'
import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { useLocale } from '@/src/hooks/useLocale'
import { TextType } from '@/src/types/text'
import { Href, Link, Stack } from 'expo-router'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import dayjs, { Dayjs } from 'dayjs'
import { Dropdown } from 'react-native-element-dropdown'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAppDispatch, useAppSelector } from '@/src/hooks/hooks'
import DateTimePicker from 'react-native-ui-datepicker'
import Modal from 'react-native-modal'
import { useGetAllTransactionsQuery } from '@/src/features/transaction/transaction.service'

import Loading from '@/src/components/Loading'
import { formatValue } from 'react-native-currency-input-fields'
import { formartGroupedBarChart } from '@/src/utils/analytics'
import { Transaction } from '@/src/types/enum'
import InfoButton from '@/src/components/buttons/InfoButton'

import GroupedBars from '@/src/components/charts/GroupedBars'
import { getCurrencySymbol } from '@/src/utils/getCurrencySymbol'
import { useSettings } from '@/src/hooks/useSetting'
import { abbrValueFormat } from '@/src/utils/abbrValueFormat'
import { X } from 'react-native-feather'

const screenWidth = Dimensions.get('window').width

export enum CustomTab {
  Tab1,
  Tab2,
}

const Page = () => {
  const { decimalSeparator, groupSeparator, disableDecimal, showCurrency, shortenAmount } =
    useSettings().styleMoneyLabel

  const router = useRouter()
  const { t } = useLocale()
  const { currencyCode } = useLocale()
  const [period, setPeriod] = useState('month')
  const [isFocusPeriod, setIsFocusPeriod] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [customPeriod, setCustomPeriod] = useState<
    | {
        startDate: Dayjs
        endDate: Dayjs
      }
    | undefined
  >({
    startDate: dayjs(),
    endDate: dayjs()
  })

  const { walletId } = useAppSelector((state) => state.auth)
  const periodOptions = [
    { label: t('period.month'), value: 'month' },
    { label: t('period.quarter'), value: 'quarter' },
    { label: t('period.year'), value: 'year' },
    { label: t('period.all'), value: 'all' },
    {
      label: t('period.custom'),
      value: 'custom',
    },
  ]

  const { isLoading, data, isError, isFetching } = useGetAllTransactionsQuery({
    walletId: walletId!,
    query: {
      period,
      sort: 'desc',
      startDate: customPeriod?.startDate && customPeriod?.startDate.toString(),
      endDate: customPeriod?.endDate ? customPeriod?.endDate?.toString() : dayjs().toString(),
    },
    
  }, {skip: showCalendar})

  const balanceTotal = useMemo(() => {
    return data?.reduce((acc, item) => {
      return item.type === 'expense' ? acc - item.amount : acc + item.amount
    }, 0)
  }, [data])
  const dataChart = useMemo(
    () =>
      formartGroupedBarChart(
        data as Transaction[],
        period,
        customPeriod?.startDate.toString(),
        customPeriod?.endDate.toString()
      ),
    [data]
  )

  return (
    <SafeAreaView style={styles.container}>
      <Loading isLoading={isFetching} text='' />
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
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.info}>
          <View>
            <ThemedText type={TextType.Title22Bold} color={TextColor.Primary}>
              {shortenAmount
                ? abbrValueFormat(Number(balanceTotal), showCurrency, currencyCode)
                : formatValue({
                    value: String(balanceTotal),
                    decimalSeparator: decimalSeparator,
                    groupSeparator: groupSeparator,
                    suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
                    decimalScale: disableDecimal ? 0 : 2,
                  })}
            </ThemedText>
          </View>
          <Dropdown
            style={[styles.dropdown, isFocusPeriod && { borderColor: 'blue' }]}
            selectedTextStyle={styles.selectedTextStyle}
            data={periodOptions}
            maxHeight={100}
            labelField='label'
            valueField='value'
            renderRightIcon={() => (
              <AntDesign
                name='down'
                size={12}
                color={BrandColor.PrimaryColor[400]}
                style={styles.icon}
              />
            )}
            itemTextStyle={{ fontSize: 12 }}
            value={period}
            onFocus={() => setIsFocusPeriod(true)}
            onBlur={() => setIsFocusPeriod(false)}
            onChange={(item) => {
              if (item.value === 'custom') {
                setShowCalendar(true)
              }
              setPeriod(item.value)
              setIsFocusPeriod(false)
            }}
          />
        </View>
        <View style={[styles.chartSection]}>
          <GroupedBars data={dataChart} />
        </View>
        <View style={styles.btn100}>
          <InfoButton
            title={t('analytics.seereportbyexpenseincome')}
            icon={() => (
              <Image
                source={require('@/src/assets/icons/circle-chart.png')}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
            )}
            buttonRight={() => (
              <Image
                source={require('@/src/assets/icons/arrow-right.png')}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
            )}
            description={t('analytics.seereportbyexpenseincomedescription')}
            onPress={() => router.navigate('/(authenticated)/(tabs)/analytics/type-analytics')}
          />
        </View>
        <View style={styles.historySection}>
          <View style={styles.headerSection}>
            <ThemedText type={TextType.CalloutSemibold} color={TextColor.Primary}>
              {t('home.history')}
            </ThemedText>
            <Link href='/(authenticated)/(tabs)/home/history' asChild>
              <Text style={styles.link}>{t('home.seeall')}</Text>
            </Link>
          </View>
          <View>
            {data?.length === 0 && (
              <ThemedText
                type={TextType.FootnoteRegular}
                color={TextColor.Secondary}
                style={{ textAlign: 'center', marginTop: 30 }}
              >
                {t(`home.notransactions`)}
              </ThemedText>
            )}
            {data?.slice(0, 8).map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  router.navigate({
                    pathname: '/(authenticated)/(tabs)/home/[id]',
                    params: { id: item._id },
                  })
                }
              >
                <TransactionItem
                  title={item.title}
                  category={item.category.name}
                  amount={item.amount}
                  icon={item.category.icon}
                  type={item.type}
                  date={item?.createdAt}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() =>
            router.navigate({
              pathname: '/(authenticated)/(tabs)/home/history',
              params: {
                period,
              },
            })
          }
        >
          <Image
            source={require('@/src/assets/icons/arrow-down-blue.png')}
            style={{ width: 24, height: 24, resizeMode: 'contain' }}
          />
          <ThemedText type={TextType.FootnoteRegular} color={BrandColor.Blue[600]}>
            {t('actions.more')}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: BackgroundColor.LightTheme.Primary,
  },
  chartSection: {
    width: '100%',
    minHeight: 270,
    marginVertical: 10,
  },
  historySection: {
    marginTop: 18,
    gap: 6,
    flex: 1,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    color: '#2A85FF',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.4,
    textTransform: 'capitalize',
  },
  info: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown: {
    width: 160,
    height: 44,
    borderColor: BrandColor.Gray[300],
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    fontSize: 12,
  },
  selectedTextStyle: {
    fontSize: 12,
    color: TextColor.Primary,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  btn100: {
    width: '100%',
  },
  linkBtn: {
    paddingBottom: 90,
    paddingTop: 20,
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modal: {
    maxHeight: 400,
    backgroundColor: '#F5FCFF',
    borderRadius: 12,
    padding: 12,
    margin: 'auto',
    marginHorizontal: 24
  },
})
