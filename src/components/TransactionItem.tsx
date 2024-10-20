import { StyleSheet, Text, Touchable, View, ViewProps } from 'react-native'
import { BrandColor, NeutralColor, TextColor } from '@/src/constants/Colors'
import React from 'react'
import { Image } from 'react-native'
import { TextType } from '@/src/types/text'
import { ThemedText } from './ThemedText'
import { formatter } from '@/src/utils/formatAmount'
import { useLocale } from '@/src/hooks/useLocale'
import categoriesDefault from '@/src/constants/Categories'
import { getImg } from '../utils/getImgFromUri'
import { format } from 'date-fns'
import { memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { formatValue } from 'react-native-currency-input-fields'
import { useSettings } from '@/src/hooks/useSetting'
import { getCurrencySymbol } from '@/src/utils/getCurrencySymbol'
import { abbrValueFormat } from '../utils/abbrValueFormat'

export type TransactionItemProps = ViewProps & {
  title: string
  category: string
  icon: string
  amount: number
  // img: () => React.ReactElement
  date: string
  type: 'income' | 'expense'
  onPress?: () => void
}

const TransactionItem = ({ title, category, amount, icon, type, date, style, onPress }: TransactionItemProps) => {
  const { currencyCode, t } = useLocale()
  const { styleMoneyLabel: {decimalSeparator, groupSeparator, showCurrency, shortenAmount, disableDecimal} } = useSettings()
  return (
    <View style={[styles.item, style]}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={styles.imgCover}>
          <Image source={getImg(icon)} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
        </View>
        <View style={styles.info}>
          <ThemedText type={TextType.FootnoteSemibold} color={TextColor.Primary}>
            {title}
          </ThemedText>
          <ThemedText type={TextType.Caption11Regular} color={NeutralColor.Black[300]}>
            {categoriesDefault.includes(category) ? t(`categories.${category}`) : category}
          </ThemedText>
        </View>
      </View>

      <View style={styles.amount}>
        <ThemedText
          type={TextType.CalloutSemibold}
          color={type === 'income' ? BrandColor.PrimaryColor[400] : BrandColor.Red[300]}
        >
          {shortenAmount ? abbrValueFormat(amount, showCurrency, currencyCode) :formatValue({
            value: String(amount),
            decimalSeparator: decimalSeparator,
            groupSeparator: groupSeparator,
            suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
            decimalScale: disableDecimal ? 0 : 2,
          })}
        </ThemedText>
        <ThemedText type={TextType.Caption11Regular} color={NeutralColor.Black[300]}>
          {format(new Date(date), "dd/MM/yyyy', 'p")}
        </ThemedText>
      </View>
    </View>
  )
}
export default memo(TransactionItem)
const styles = StyleSheet.create({
  item: {
    minHeight: 64,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: BrandColor.Gray[100],
    borderBottomWidth: 1,
    justifyContent: 'space-between',
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
  },
  amount: {
    gap: 2,
    
    alignItems: 'flex-end',
  },
})
