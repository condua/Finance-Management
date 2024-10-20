import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import { TextColor } from '@/src/constants/Colors'
import { useLocale } from '@/src/hooks/useLocale'
import { AntDesign } from '@expo/vector-icons'
import { Link, Stack, useRouter } from 'expo-router'
import { X } from 'react-native-feather'
const Layout = () => {
  const { t } = useLocale()
  const router = useRouter()
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerTitle: t('analytics.header'),
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

      <Stack.Screen
        name='create-category'
        options={{
          headerTitle: t('analytics.addnewcategories'),
          animation: 'slide_from_bottom',
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  onPress={() => router.back()}
                  type='btn'
                  button={() => <X width={24} height={24} color={TextColor.Primary} />}
                />
              )}
            />
          ),

          // headerShown: false,
        }}
      />
      <Stack.Screen
        name='type-analytics'
        options={{
          headerTitle: t('analytics.header'),
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
      
    </Stack>
  )
}
export default Layout
