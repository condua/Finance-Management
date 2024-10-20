import { Image, StyleSheet, Text, View } from 'react-native'
import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { ThemedText } from './ThemedText'
import { TextType } from '@/src/types/text'
import { getImg, getWaleltImg } from '@/src/utils/getImgFromUri'
import { useLocale } from '@/src/hooks/useLocale'
import { formatValue } from 'react-native-currency-input-fields'
import { getCurrencySymbol } from '@/src/utils/getCurrencySymbol'
import { useSettings } from '@/src/hooks/useSetting'
import { abbrValueFormat } from '@/src/utils/abbrValueFormat'

interface WalletItemProps {
  name: string
  balance: number
  icon: string
  isDefault?: boolean
}

const WalletItem = ({ name, balance, icon, isDefault }: WalletItemProps) => {
  const { t } = useLocale()
  const { currencyCode } = useLocale()
  const { styleMoneyLabel: { decimalSeparator, groupSeparator, showCurrency, disableDecimal,shortenAmount } } = useSettings()
  return (
    <View style={[styles.container, isDefault && { borderColor: BrandColor.PrimaryColor[400] }]}>
      <View style={styles.icon}>
        <Image source={getWaleltImg(icon)} style={styles.image} />
      </View>
      <View style={styles.info}>
        <ThemedText type={TextType.HeadlineBold} color={TextColor.Primary}>
          {name}
        </ThemedText>
        <ThemedText
          type={TextType.SubheadlineBold}
          color={TextColor.Secondary}
          style={{ lineHeight: 28 }}
        >
          {`${t('wallets.balance')}: ${
            shortenAmount
              ? abbrValueFormat(Number(balance), showCurrency, currencyCode)
              : formatValue({
                  value: String(balance),
                  decimalSeparator: decimalSeparator,
                  groupSeparator: groupSeparator,
                  suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
                  decimalScale: disableDecimal ? 0 : 2,
                })
          }`}
        </ThemedText>
      </View>
      <View style={styles.check}>
        {isDefault && (
          <Image source={require('@/src/assets/icons/checked.png')} style={styles.checkedIcon} />
        )}
      </View>
    </View>
  )
}
export default WalletItem
const styles = StyleSheet.create({
  container: {
    height: 72,
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
    gap: 8,
    padding: 10,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    borderColor: BrandColor.Gray[100],
    flexDirection: 'row',
    borderWidth: 1,
    
  },
  icon: {
    height: 52,
    width: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BrandColor.PrimaryColor[50],
  },
  image: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  info: {
    gap: 4,
    flex: 3,
  },
  checkedIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  check: {
   justifyContent: 'center',
   alignItems: 'center',
   flex: 1,
  }
})
