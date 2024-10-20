import { StyleSheet, Text, View } from 'react-native'
import { BackgroundColor, BrandColor, NeutralColor, TextColor } from '@/src/constants/Colors'
import React from 'react'
import { Image } from 'react-native'
import { TextType } from '@/src/types/text'
import { ThemedText } from '@/src/components/ThemedText'
import { formatter } from '@/src/utils/formatAmount'
import { useLocale } from '@/src/hooks/useLocale'
import { format } from 'date-fns'
import { abbrValueFormat } from '@/src/utils/abbrValueFormat'
import { formatValue } from 'react-native-currency-input-fields'
import { getCurrencySymbol } from '@/src/utils/getCurrencySymbol'
import { useSettings } from '@/src/hooks/useSetting'

export type AmountItemProps = {
  title?: string
  amount: number
  date: string
}

const AmountItem = ({ title, amount, date }: AmountItemProps) => {
  const { currencyCode } = useLocale()
    const { decimalSeparator, groupSeparator, disableDecimal, showCurrency, shortenAmount } =
      useSettings().styleMoneyLabel

  return (
    <View style={styles.item}>
      <View style={styles.amount}>
        <ThemedText type={TextType.Title22Bold} color={BrandColor.Red[300]}>
          {shortenAmount
            ? abbrValueFormat(Number(amount), showCurrency, currencyCode)
            : formatValue({
                value: String(amount),
                decimalSeparator: decimalSeparator,
                groupSeparator: groupSeparator,
                suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
                decimalScale: disableDecimal ? 0 : 2,
              })}
        </ThemedText>
      </View>
      <View style={styles.info}>
        {/* <ThemedText type={TextType.FootnoteSemibold} color={TextColor.Primary}>
          {title}
        </ThemedText> */}
        <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Secondary}>
          {format(new Date(date), 'PPP')}
        </ThemedText>
      </View>
    </View>
  )
}
export default AmountItem
const styles = StyleSheet.create({
  item: {
    minHeight: 64,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderColor: BrandColor.Gray[100],
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: BackgroundColor.LightTheme.Primary,
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
  info: {
    gap: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  amount: {
    flex: 3,
    gap: 2,
    alignItems: 'flex-start',
  },
})
