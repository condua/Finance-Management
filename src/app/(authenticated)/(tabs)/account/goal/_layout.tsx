import { Stack } from 'expo-router'
import { View, Text } from 'react-native'
const Layout = () => {
  return (
    <Stack screenOptions={{headerShown: true}}>
      <Stack.Screen name='index' />
      
    </Stack>
  )
}
export default Layout