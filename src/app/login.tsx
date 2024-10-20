import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BrandColor, NeutralColor, TextColor } from '../constants/Colors'
import { ThemedText } from '../components/ThemedText'
import { useLocale } from '../hooks/useLocale'
import { TextType } from '../types/text'
import { useLoginMutation } from '@/src/features/auth/auth.service'
import { setAuth } from '@/src/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@/src/hooks/hooks'
import Input from '../components/Input'
import { useEffect, useMemo, useState } from 'react'
import { EmailRegExp, PasswordRegExp } from '../utils/RegExp'
import Button from '@/src/components/buttons/Button'
import { Ionicons } from '@expo/vector-icons'
import { Eye, EyeOff } from 'react-native-feather'
import { useRouter } from 'expo-router'
import {isEntityError, isFetchBaseQueryError} from '@/src/utils/helpers'


interface FormData {
  email: string
  password: string
}

const initialState: FormData = {
  email: '',
  password: '',
}

type FormError = {
  [key in keyof typeof initialState]: string
} | null

const Page = () => {
  const router = useRouter()
  const { t } = useLocale()
  const [isSecure, setIsSecure] = useState(true)
  const [form, setForm] = useState<FormData>(initialState)
  const [state, setState] = useState<'normal' | 'focused' | 'typing' | 'error'>('normal')
  const [login, loginResult] = useLoginMutation()

  const dispatch = useAppDispatch()

  const [isValidated, setIsValidated] = useState({
    email: false,
    password: false,
  })
  const toggleSecure = () => {
    setIsSecure((prev) => !prev)
  }
  const errorForm: FormError = useMemo(() => {
    const errorResult = loginResult.error
    if (isEntityError(errorResult)) {
      console.log(errorResult.data)
      return errorResult?.data.error as FormError
    }
    return null
  }, [loginResult])

  
  useEffect(() => {
    if (loginResult.data) {
      setForm(initialState)
    }
  }, [loginResult])
  const handleLogin = async () => {
    try {
      await login(form).unwrap()
    } catch (error) {
      console.log('🚀 ~ handleLogin ~ error:', error)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image source={require('@/src/assets/icons/logo.png')} style={styles.img} />
      </View>
      <View style={styles.welcome}>
        <ThemedText type={TextType.Title22Bold} color={TextColor.Primary} style={styles.textAlign}>
          {t('login.title')}
        </ThemedText>
        <ThemedText
          type={TextType.SubheadlineRegular}
          color={TextColor.Secondary}
          style={styles.textAlign}
        >
          {t('login.description')}
        </ThemedText>
      </View>
      <View style={styles.form}>
        <Input
          value={form.email}
          placeholder={t('login.email')}
          buttonLeft={() => (
            <Image
              source={require('@/src/assets/icons/mail.png')}
              width={24}
              height={24}
              resizeMode='contain'
            />
          )}
          validationOptions={{
            pattern: [EmailRegExp, 'Invalid email address'],
          }}
          validate={(isValid: boolean) => {
            setIsValidated((prev) => ({ ...prev, email: isValid }))
          }}
          onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
          error={!!errorForm?.email}
          errorMessage={errorForm?.email}
        />
        <Input
          value={form.password}
          placeholder={t('login.password')}
          buttonLeft={() => <Image source={require('@/src/assets/icons/lock-outline.png')} />}
          buttonRight={() => (
            <TouchableOpacity onPress={toggleSecure}>
              {isSecure ? (
                <EyeOff width={24} height={24} color={BrandColor.PrimaryColor[400]} />
              ) : (
                <Eye width={24} height={24} color={BrandColor.PrimaryColor[400]} />
              )}
            </TouchableOpacity>
          )}
          isSecure={isSecure}
          validationOptions={{
            pattern: [
              PasswordRegExp,
              'Password must contain at least one number and one uppercase and lowercase letter',
            ],
            minLength: [6, 'Password must be at least 6 characters'],
          }}
          validate={(isValid: boolean) => {
            setIsValidated((prev) => ({ ...prev, password: isValid }))
          }}
          onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
          error={!!errorForm?.password}
          errorMessage={errorForm?.password}
        />
      </View>
      <View style={styles.forgotPassword}>
        <View></View>
        {/* <TouchableOpacity onPress={() => router.navigate('/reset-password')}>
          <ThemedText type={TextType.Caption12Regular} color={BrandColor.Blue[600]}>
            {t('login.forgot')}
          </ThemedText>
        </TouchableOpacity> */}
      </View>
      <View style={styles.signIn}>
        <Button
          text={t('login.signin')}
          size='large'
          state={isValidated.email && isValidated.password ? 'normal' : 'disabled'}
          onPress={handleLogin}
          textColor={NeutralColor.White[50]}
          type='primary'
          isLoading={loginResult.isLoading}
        />
      </View>
      <View style={styles.signUpRedirect}>
        <ThemedText type={TextType.FootnoteRegular} color={TextColor.Primary}>
          {t('login.noaccount')}
        </ThemedText>
        <TouchableOpacity onPress={() => router.navigate('/register')}>
          <ThemedText type={TextType.FootnoteSemibold} color={BrandColor.Blue[600]}>
            {t('login.signup')}
          </ThemedText>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.oauth}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View style={[styles.seperator, { width: '45%' }]}></View>
          <Text>or</Text>
          <View style={[styles.seperator, { width: '45%' }]}></View>
        </View>
        <Button
          text={t('login.apple')}
          size='large'
          state='normal'
          onPress={() => console.log('facebook')}
          buttonLeft={() => <Ionicons name='logo-apple' size={24} color={NeutralColor.White[50]} />}
          textColor={NeutralColor.White[50]}
          style={{ backgroundColor: NeutralColor.Black[950] }}
          type='primary'
        />
        <Button
          text={t('login.google')}
          size='large'
          state='normal'
          onPress={() => console.log('google')}
          buttonLeft={() => <Image source={require('@/src/assets/icons/google.jpg')} />}
          textColor={TextColor.Primary}
          type='tertiary'
        />
      </View> */}
    </View>
  )
}
export default Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeutralColor.White[50],
  },
  logo: {
    alignItems: 'center',
    marginTop: 32,
  },
  img: {
    borderRadius: 28,
    width: 114,
    height: 114,
  },
  welcome: {
    marginTop: 12,
    gap: 4,
  },
  textAlign: {
    textAlign: 'center',
  },
  form: {
    marginTop: 24,
    width: '100%',
    paddingHorizontal: 24,
    gap: 22,
  },
  input: {
    height: 50,
    borderRadius: 14,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  forgotPassword: {
    marginTop: 36,
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signIn: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  signUpRedirect: {
    marginTop: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    gap: 4,
    alignSelf: 'center',
  },
  oauth: {
    marginTop: 24,
    paddingHorizontal: 24,
    gap: 14,
  },
  seperator: {
    height: 1,
    backgroundColor: BrandColor.Gray[400],
  },
})
