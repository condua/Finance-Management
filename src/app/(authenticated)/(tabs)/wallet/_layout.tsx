import { Stack } from 'expo-router'
import { View, Text } from 'react-native'
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name='create-wallet'
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name='edit-wallets' />
      <Stack.Screen name='edit-wallet' />
    </Stack>
  )
}
export default Layout