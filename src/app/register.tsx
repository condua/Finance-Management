import { useSignupMutation } from '@/src/features/auth/auth.service'
import { setAuth } from '@/src/features/auth/authSlice'
import { useAppDispatch } from '@/src/hooks/hooks'
import {  Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BrandColor, NeutralColor, TextColor } from '@/src/constants/Colors'
import { ThemedText } from '@/src/components/ThemedText'
import { useLocale } from '@/src/hooks/useLocale'
import { TextType } from '@/src/types/text'
import Input from '@/src/components/Input'
import { useEffect, useMemo, useState } from 'react'
import { EmailRegExp, PasswordRegExp } from '@/src/utils/RegExp'
import Button from '@/src/components/buttons/Button'
import { Ionicons } from '@expo/vector-icons'
import { Eye, EyeOff } from 'react-native-feather'
import { useRouter } from 'expo-router'
import { isEntityError } from '@/src/utils/helpers'

interface FormData {
  email: string
  password: string
}

const initialState: FormData = {
  email: '',
  password: '',
}

type FormError =
  | {
      [key in keyof typeof initialState]: string
    }
  | null

const Page = () => {
  const router = useRouter()
  const { t } = useLocale()
  const [isSecure, setIsSecure] = useState(true)
  const [form, setForm] = useState<FormData>(initialState)
  const [state, setState] = useState<'normal' | 'focused' | 'typing' | 'error'>('normal')
  const [isValidated, setIsValidated] = useState({
    email: false,
    password: false,
  })

  const [register, signUpResult] = useSignupMutation()
  const dispatch = useAppDispatch()
  const errorForm: FormError = useMemo(() => {
    const errorResult = signUpResult.error
    if (isEntityError(errorResult)) {
      console.log(errorResult.data)
      return errorResult?.data.error as FormError
    }
    return null
  }, [signUpResult])
  useEffect(() => {
    if (signUpResult.data) {
      dispatch(
        setAuth({
          tokens: signUpResult.data.tokens,
          user: signUpResult.data.user,
          isAuthenticated: true,
          walletId: '',
        })
      )
    }
  }, [signUpResult])

  const handleRegister = async () => {
    try {
      await register(form).unwrap()
    } catch (error) {
      console.log('🚀 ~ handleRegister ~ error:', error)
    }
  }

  const toggleSecure = () => {
    setIsSecure((prev) => !prev)
  }

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image source={require('@/src/assets/icons/logo.png')} style={styles.img} />
      </View>
      <View style={styles.welcome}>
        <ThemedText type={TextType.Title22Bold} color={TextColor.Primary} style={styles.textAlign}>
          {t('signup.title')}
        </ThemedText>
        <ThemedText
          type={TextType.SubheadlineRegular}
          color={TextColor.Secondary}
          style={styles.textAlign}
        >
          {t('signup.description')}
        </ThemedText>
      </View>
      <View style={styles.form}>
        <Input
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          placeholder={t('signup.email')}
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
          error={!!errorForm?.email}
          errorMessage={errorForm?.email}
        />
        <Input
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          placeholder={t('signup.password')}
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
        />
      </View>

      <View style={styles.signIn}>
        <Button
          text={t('signup.signup')}
          size='large'
          state={isValidated.email && isValidated.password ? 'normal' : 'disabled'}
          onPress={handleRegister}
          textColor={NeutralColor.White[50]}
          type='primary'
          isLoading={signUpResult.isLoading}
        />
      </View>
      <View style={styles.signUpRedirect}>
        <ThemedText type={TextType.FootnoteRegular} color={TextColor.Primary}>
          {t('signup.haveaccount')}
        </ThemedText>
        <TouchableOpacity onPress={() => router.navigate('/login')}>
          <ThemedText type={TextType.FootnoteSemibold} color={BrandColor.Blue[600]}>
            {t('signup.signin')}
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
    marginTop: 24,
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signIn: {
    marginTop: 48,
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
