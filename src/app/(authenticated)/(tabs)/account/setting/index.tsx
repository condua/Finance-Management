import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import { ThemedText } from '@/src/components/ThemedText'
import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { useLocale } from '@/src/hooks/useLocale'
import { TextType } from '@/src/types/text'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import { Href, Stack } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { abbrValue, formatValue } from 'react-native-currency-input-fields'
import { Switch } from 'react-native-ui-lib'
import { getCurrencySymbol } from '@/src/utils/getCurrencySymbol'
import { Image } from 'react-native'
import { useSettings } from '@/src/hooks/useSetting'
import { abbrValueFormat } from '@/src/utils/abbrValueFormat'

interface SettingProperties {
  shorten: boolean
  showCurrency: boolean
  showDecimal: boolean
  separator: {
    decimal: '.' | ','
    group: '.' | ','
  }
}

const initState: SettingProperties = {
  shorten: false,
  showCurrency: true,
  showDecimal: true,
  separator: {
    decimal: '.',
    group: ',',
  },
}

const Page = () => {
  const {
    styleMoneyLabel: { shortenAmount, showCurrency, decimalSeparator, groupSeparator, disableDecimal },
    changeStyleMoneyLabel
  } = useSettings()
  const { t, currencyCode } = useLocale()
  const [setting, setSetting] = useState<SettingProperties>(initState)
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t('settings.settings'),
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
            />
          ),
        }}
      />
      <View style={[styles.output]}>
        <ThemedText type={TextType.Title20Semibold} color={TextColor.Primary}>
          {shortenAmount
            ? `${abbrValueFormat(19995555.5, showCurrency, currencyCode)} `
            : formatValue({
                value: String(19995555.5),
                decimalSeparator: decimalSeparator,
                groupSeparator: groupSeparator,
                suffix: showCurrency ? getCurrencySymbol(currencyCode) : '',
                decimalScale: disableDecimal ? 0 : 2,
              })}
        </ThemedText>
      </View>
      <View style={[styles.form, { marginTop: 32 }]}>
        <View style={styles.item}>
          <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
            {t('settings.shortenamount')}
          </ThemedText>
          <View style={styles.right}>
            <Switch
              value={shortenAmount}
              onValueChange={(value: boolean) =>
                changeStyleMoneyLabel({
                  showCurrency,
                  decimalSeparator,
                  groupSeparator,
                  disableDecimal,
                  shortenAmount: value,
                })
              }
              onColor={BrandColor.PrimaryColor[400]}
              offColor={BrandColor.Gray[100]}
            />
          </View>
        </View>
        <View style={styles.item}>
          <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
            {t('settings.showcurrency')}
          </ThemedText>
          <View style={styles.right}>
            <Switch
              value={showCurrency}
              onValueChange={(value: boolean) =>
                changeStyleMoneyLabel({
                  shortenAmount,
                  decimalSeparator,
                  groupSeparator,
                  disableDecimal,
                  showCurrency: value,
                })
              }
              onColor={BrandColor.PrimaryColor[400]}
              offColor={BrandColor.Gray[100]}
            />
          </View>
        </View>
      </View>
      <ThemedText
        type={TextType.SubheadlineRegular}
        color={TextColor.Primary}
        style={{ marginTop: 24 }}
      >
        {t('settings.decimalseparator')}
      </ThemedText>
      <View style={styles.form}>
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            changeStyleMoneyLabel({
              shortenAmount,
              showCurrency,
              disableDecimal,
              decimalSeparator: '.',
              groupSeparator: ',',
            })
          }
        >
          <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
            {formatValue({
              value: '1995.95',
              decimalSeparator: '.',
              groupSeparator: ',',
            })}
          </ThemedText>
          <View style={styles.right}>
            {decimalSeparator === '.' && groupSeparator === ',' ? (
              <Image
                source={require('@/src/assets/icons/checked.png')}
                style={styles.checkedIcon}
              />
            ) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            changeStyleMoneyLabel({
              shortenAmount,
              showCurrency,
              disableDecimal,
              decimalSeparator: ',',
              groupSeparator: '.',
            })
          }
        >
          <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
            {formatValue({
              value: '1995.95',
              decimalSeparator: ',',
              groupSeparator: '.',
            })}
          </ThemedText>
          <View style={styles.right}>
            {decimalSeparator === ',' && groupSeparator === '.' ? (
              <Image
                source={require('@/src/assets/icons/checked.png')}
                style={styles.checkedIcon}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      </View>

      <ThemedText
        type={TextType.SubheadlineRegular}
        color={TextColor.Primary}
        style={{ marginTop: 24 }}
      >
        {t('settings.alwaysshowdecimal')}
      </ThemedText>
      <View style={styles.form}>
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            changeStyleMoneyLabel({
              shortenAmount,
              showCurrency,
              decimalSeparator,
              groupSeparator,
              disableDecimal: false,
            })
          }
        >
          <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
            {formatValue({
              value: '19.95',
              decimalSeparator: decimalSeparator,
              groupSeparator: groupSeparator,
              decimalScale: 2,
            })}
          </ThemedText>
          <View style={styles.right}>
            {!disableDecimal ? (
              <Image
                source={require('@/src/assets/icons/checked.png')}
                style={styles.checkedIcon}
              />
            ) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            changeStyleMoneyLabel({
              shortenAmount,
              showCurrency,
              decimalSeparator,
              groupSeparator,
              disableDecimal: true,
            })
          }
        >
          <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
            {formatValue({
              value: '19.95',
              decimalSeparator: decimalSeparator,
              groupSeparator: groupSeparator,
              decimalScale: 0,
            })}
          </ThemedText>
          <View style={styles.right}>
            {disableDecimal ? (
              <Image
                source={require('@/src/assets/icons/checked.png')}
                style={styles.checkedIcon}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  output: {
    marginTop: 12,
    height: 90,
    borderRadius: 12,
    width: '100%',
    backgroundColor: BackgroundColor.LightTheme.Primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    marginTop: 12,
    borderRadius: 12,
    gap: 1,
    width: '100%',
    overflow: 'hidden',
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: BackgroundColor.LightTheme.Primary,
  },
  imageIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  right: {
    position: 'absolute',
    right: 12,
  },
  checkedIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
})
