import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { BrandColor } from '@/src/constants/Colors'
import { Filter, Search } from 'react-native-feather'
import { useState } from 'react'


interface SearchBarProps {
 onChangeText: (text: string) => void
 value: string
}

const SearchBar = ({ onChangeText, value }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <View style={[styles.searchBar, isFocused && { borderColor: BrandColor.Blue[600] }]}>
      <Search width={24} height={24} color={BrandColor.PrimaryColor[400]} />
      <TextInput
        placeholder='Search'
        value={value}
        cursorColor={BrandColor.PrimaryColor[400]}
        style={styles.searchInput}
        onFocus={() => setIsFocused(true)}
        onEndEditing={() => setIsFocused(false)}
        onChangeText={onChangeText}
      />
    </View>
  )
}
export default SearchBar
const styles = StyleSheet.create({
  searchBar: {
    height: 44,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BrandColor.Gray[200],
    flexDirection: 'row',
    flex: 1,
    gap: 8,
    alignItems: 'center',
  },
  searchInput: {
   flex: 1,
  },

})
