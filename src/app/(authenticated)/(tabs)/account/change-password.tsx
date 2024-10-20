import BottomContainer from '@/src/components/BottomContainer'
import Button from '@/src/components/buttons/Button'
import Input from '@/src/components/Input'
import Header from '@/src/components/navigation/Header'
import HeaderButton from '@/src/components/navigation/HeaderButton'
import { BackgroundColor, TextColor } from '@/src/constants/Colors'
import { useChangePasswordMutation } from '@/src/features/auth/auth.service'
import { clearAuth } from '@/src/features/auth/authSlice'
import { useAppDispatch } from '@/src/hooks/hooks'
import { useLocale } from '@/src/hooks/useLocale'
import { isEntityError } from '@/src/utils/helpers'
import { PasswordRegExp } from '@/src/utils/RegExp'
import { AntDesign } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'


const inittialPassword = {
  oldPassword: '',
  newPassword: '',
}

type FormError =
  | {
      [key in keyof typeof inittialPassword]: string
    }
  | null



const Page = () => {
 const {t} = useLocale()
 const router = useRouter()
 const dispatch = useAppDispatch()
 const [password, setPassword] = useState(inittialPassword)

 const [changePassword, changePasswordResult] = useChangePasswordMutation()


 const [isValidated, setIsValidated] = useState({
   oldPassword: false,
   newPassword: false,
 })


const errorForm: FormError = useMemo(() => {
  const errorResult = changePasswordResult.error
  if (isEntityError(errorResult)) {
    console.log(errorResult.data)
    return errorResult?.data.error as FormError
  }
  return null
}, [changePasswordResult])


useEffect(() => {
 if(changePasswordResult.isSuccess) {
   Alert.alert('Successfully!!', 'Do you want to login again?', [
     {
       text: 'Cancel',
       onPress: () => router.back(),
       style: 'cancel',
     },
     {
       text: 'Ok',
       onPress: () => dispatch(clearAuth()),
       style: 'default',
     },
   ])
 }
}, [changePasswordResult])

 const handleChangePassword = async() => {
   try {
     await changePassword(password).unwrap()
   } catch (error) {
     console.log('error', error)
   }
 }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t('settings.changepassword'),
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
      <View style={{ marginTop: 40, gap: 32 }}>
        <Input
          label={t('settings.oldpassword')}
          placeholder={t('settings.enteroldpassword')}
          value={password.oldPassword}
          onChangeText={(text) => setPassword({ ...password, oldPassword: text })}
          validationOptions={{
            pattern: [PasswordRegExp, 'Invalid Password'],
          }}
          validate={(isValid: boolean) => {
            setIsValidated((prev) => ({ ...prev, oldPassword: isValid }))
          }}
          error={!!errorForm?.oldPassword}
          errorMessage={errorForm?.oldPassword}
          isSecure={true}
        />
        <Input
          label={t('settings.newpassword')}
          placeholder={t('settings.enternewpassword')}
          value={password.newPassword}
          onChangeText={(text) => setPassword({ ...password, newPassword: text })}
          validationOptions={{
            pattern: [PasswordRegExp, 'Invalid New Password'],
          }}
          validate={(isValid: boolean) => {
            setIsValidated((prev) => ({ ...prev, newPassword: isValid }))
          }}
          error={!!errorForm?.newPassword}
          errorMessage={errorForm?.newPassword}
          isSecure={true}
        />
      </View>
        <BottomContainer>
          <Button
            type='primary'
            text={t('actions.save')}
            size='large'
            state={isValidated.oldPassword && isValidated.newPassword ? 'normal' : 'disabled'}
            onPress={handleChangePassword}
            disabled={!isValidated.oldPassword || !isValidated.newPassword}
            isLoading={changePasswordResult.isLoading}
          />
        </BottomContainer>
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
 container: {
  flex: 1,
  alignItems: 'center',
  paddingHorizontal: 24,
  backgroundColor: BackgroundColor.LightTheme.Primary,
 }
})