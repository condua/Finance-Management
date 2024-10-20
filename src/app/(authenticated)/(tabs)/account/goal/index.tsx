import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import { ThemedText } from '@/src/components/ThemedText'
import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { useLocale } from '@/src/hooks/useLocale'
import { AntDesign, Fontisto } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { useGetAllPlansQuery } from '@/src/features/plan/plan.service'
import { useAppSelector } from '@/src/hooks/hooks'
import { TextType } from '@/src/types/text'
import { useState } from 'react'
const { format } = require('date-fns')

import { formatter } from '@/src/utils/formatAmount'

import { endOfMonth, formatDate } from 'date-fns'
import { Amount, FinancialPlan } from '@/src/types/enum'
import Loading from '@/src/components/Loading'
import BottomContainer from '@/src/components/BottomContainer'
import Button from '@/src/components/buttons/Button'
import { useSettings } from '@/src/hooks/useSetting'
import { getCurrencySymbol } from '@/src/utils/getCurrencySymbol'
import { formatValue } from 'react-native-currency-input-fields'
import { abbrValueFormat } from '@/src/utils/abbrValueFormat'

type AndroidMode = 'date' | 'time'

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const initalGoal: Omit<FinancialPlan, '_id'> = {
  name: '',
  end_date: endOfMonth(new Date()).toString(),
  type: 'goal',
  attributes: {
    target_amount: 0,
    current_amount: 0,
    records: [] as Amount[],
  },
}

const Page = () => {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const { currencyCode } = useLocale()
  const { decimalSeparator, groupSeparator, disableDecimal, showCurrency, shortenAmount } =
    useSettings().styleMoneyLabel

  const { t } = useLocale()
  const { walletId } = useAppSelector((state) => state.auth)

  const { data: goals, isFetching } = useGetAllPlansQuery({
    walletId,
    type: 'goal',
  })

  // const goals = data?.metadata || []
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t('goals.header'),
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
              // headerRight={() => (
              //   <HeaderButton
              //     type='text'
              //     text={t('actions.add')}
              //     onPress={() =>
              //       router.navigate('/(authenticated)/(tabs)/account/goal/create-goal')
              //     }
              //   />
              // )}
            />
          ),
        }}
      />
      <Loading isLoading={isFetching} text='Loading...' />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollView}>
          {goals?.length === 0 && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <ThemedText
                type={TextType.FootnoteRegular}
                color={TextColor.Secondary}
                style={{ textAlign: 'center', marginTop: 30 }}
              >
                {t('goals.nogoals')}
              </ThemedText>
            </View>
          )}
          {goals?.map((goal: any, index: number) => {
            return (
              <TouchableOpacity
                key={goal._id}
                style={styles.item}
                onPress={() =>
                  router.push({
                    pathname: '/(authenticated)/(tabs)/account/goal/[id]',
                    params: { id: goal._id },
                  })
                }
              >
                <View style={styles.itemName}>
                  <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                    {goal.name}
                  </ThemedText>
                </View>
                <ThemedText type={TextType.Title22Bold} color={TextColor.Primary}>
                  {shortenAmount
                    ? abbrValueFormat(Number(goal.attributes.target_amount), showCurrency, currencyCode)
                    : formatValue({
                        value: String(goal.attributes.target_amount),
                        decimalSeparator: decimalSeparator,
                        groupSeparator: groupSeparator,
                        suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
                        decimalScale: disableDecimal ? 0 : 2,
                      })}
                </ThemedText>
                <View style={styles.outer}>
                  <View
                    style={[
                      styles.inner,
                      {
                        width: `${
                          Math.round(
                            ((goal.attributes.current_amount || 0) * 100) /
                              (goal.attributes.target_amount || 1)
                          ) >= 100
                            ? 100
                            : Math.round(
                                (goal.attributes.current_amount * 100) /
                                  goal.attributes.target_amount
                              )
                        }%`,
                      },
                    ]}
                  />
                </View>
                <ThemedText type={TextType.FootnoteRegular} color={TextColor.Secondary}>
                  {format(new Date(goal.end_date), 'PP')}
                </ThemedText>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={{ height: 100 }}></View>
      </ScrollView>
      <BottomContainer>
        <Button
          style={{ marginTop: 24 }}
          onPress={() => router.push('/(authenticated)/(tabs)/account/goal/create-goal')}
          text={t('actions.add')}
          type='primary'
          state='normal'
          size='large'
        />
      </BottomContainer>
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    // backgroundColor: BackgroundColor.LightTheme.Primary,
    flex: 1,
    paddingHorizontal: 24,
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
    gap: screenWidth * 0.03,
  },
  item: {
    width: '48%',
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
    borderWidth: 1,
    minWidth: '50%',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: BrandColor.Gray[200],
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
})
