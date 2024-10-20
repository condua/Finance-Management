import { Stack } from 'expo-router'
import { View, Text } from 'react-native'
const _layout = () => {
  return (
    <Stack
    >
      <Stack.Screen
        name='money-label'
        options={{
          headerTitle: 'Setting',
        }}
        />

    </Stack>
  )
}
export default _layout