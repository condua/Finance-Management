import { ThemedText } from '@/src/components/ThemedText'
import { BackgroundColor, TextColor } from '@/src/constants/Colors'
import { useLocale } from '@/src/hooks/useLocale'
import { TextType } from '@/src/types/text'
import { DefaultTheme } from '@react-navigation/native'
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { currencies } from '@/src/constants/Currency'
import { useCallback, useMemo, useState } from 'react'
import SearchBar from '@/src/components/SearchBar'
import { useDebounce } from '@/src/hooks/useDebounce'
const ICON_SIZE = 28

type CurrencyItemProps = {
  icon: string
  name: string
  code: string
  symbol: string
}

const Item = ({ icon, name, symbol, code }: CurrencyItemProps) => {
  const { currencyCode, changeCurrency } = useLocale()

  return (
    <TouchableOpacity style={styles.item} onPress={() => changeCurrency(code)}>
      <Image source={icon as ImageSourcePropType} style={styles.imageIcon} />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          flex: 1,
          paddingRight: 24,
        }}
      >
        <ThemedText type={TextType.SubheadlineRegular} color={TextColor.Primary}>
          {`${name} - ${symbol}`}
        </ThemedText>
      </View>
      {currencyCode === code ? (
        <View style={styles.right}>
          <Image source={require('@/src/assets/icons/checked.png')} />
        </View>
      ) : null}
    </TouchableOpacity>
  )
}

const Page = () => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const searchCurrencies = useMemo(() => {
    if(!debouncedSearch) return currencies
    return currencies.filter((currency) =>  currency.name.toLocaleLowerCase().includes(debouncedSearch.toLowerCase())
   )
  },[debouncedSearch, currencies])


  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar value={search} onChangeText={(text) => setSearch(text)} />
      </View>
      <FlatList
        data={searchCurrencies}
        renderItem={({ item }) => (
          <Item icon={item.icon} code={item.code} name={item.name} symbol={item.symbol} />
        )}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    paddingHorizontal: 24,
  },
  form: {
    marginTop: 12,
    gap: 1,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: DefaultTheme.colors.background,
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 10,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    // backgroundColor: 'red'
  },
  imageIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: BackgroundColor.LightTheme.Secondary,
    resizeMode: 'contain',
  },
  right: {
    position: 'absolute',
    right: 0,
  },
  searchBar: {
    width: '100%',
    height: 44,
    marginTop: 24,
    marginBottom: 32,
  }
})
