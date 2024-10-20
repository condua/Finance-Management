import { Tabs, useRouter, useSegments } from 'expo-router'
import { Image } from 'react-native'
import TabBar from '@/src/components/navigation/TabBar'
import { useLocale } from '@/src/hooks/useLocale'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

const Layout = () => {
  const router = useRouter()
  const segment = useSegments()
  const { t } = useLocale()
  return (
    <BottomSheetModalProvider>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ tabBarHideOnKeyboard: true }}
      >
        <Tabs.Screen
          name='home'
          options={{
            tabBarLabel: t('tabLabel.home'),
            headerShown: false,
            tabBarIcon: ({ size, focused, color }) => {
              if (focused) {
                return <Image source={require('@/src/assets/icons/home-active.jpg')} />
              }
              return <Image source={require('@/src/assets/icons/home.jpg')} />
            },
            tabBarHideOnKeyboard: true,
            tabBarStyle: { display: segment.length > 3 ? 'none' : 'flex' },
          }}
        />
        <Tabs.Screen
          name='wallet'
          options={{
            tabBarLabel: t('tabLabel.wallets'),
            headerTitleAlign: 'center',
            headerShown: false,
            title: 'Statistics',
            tabBarIcon: ({ size, focused, color }) => {
              if (focused) {
                return (
                  <Image
                    source={require('@/src/assets/icons/wallet-active.png')}
                    style={{ width: size, height: size, resizeMode: 'contain' }}
                  />
                )
              }
              return (
                <Image
                  source={require('@/src/assets/icons/wallet.png')}
                  style={{ width: size, height: size, resizeMode: 'contain' }}
                />
              )
            },
            tabBarHideOnKeyboard: true,
            tabBarStyle: { display: segment.length > 3 ? 'none' : 'flex' },
          }}
        />

        <Tabs.Screen
          name='transaction'
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <Image
                  source={require('@/src/assets/icons/plus-circle.jpg')}
                  style={{ paddingTop: 12 }}
                />
              )
            },
            headerTitle: t('transaction.newtransaction'),
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarStyle: { display: segment[2] === 'transaction' ? 'none' : 'flex' },
          }}
        />
        <Tabs.Screen
          name='analytics'
          options={{
            headerShown: false,
            tabBarLabel: t('tabLabel.analytics'),
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ size, focused, color }) => {
              if (focused) {
                return <Image source={require('@/src/assets/icons/analytics-active.jpg')} />
              }
              return <Image source={require('@/src/assets/icons/analytics.jpg')} />
            },
            tabBarStyle: { display: segment.length > 3 ? 'none' : 'flex' },
          }}
        />
        <Tabs.Screen
          name='account'
          options={{
            tabBarLabel: t('tabLabel.more'),
            headerShown: false,
            tabBarIcon: ({ size, focused, color }) => {
              if (focused) {
                return <Image source={require('@/src/assets/icons/grid2-active.png')} />
              }
              return <Image source={require('@/src/assets/icons/grid2.png')} />
            },
            tabBarHideOnKeyboard: true,
            tabBarStyle: { display: segment.length > 3 ? 'none' : 'flex' },
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  )
}
export default Layout
