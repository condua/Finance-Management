import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  type TouchableOpacityProps,
  type ViewProps,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Text,
  TextInputEndEditingEventData,
} from 'react-native'
import { ThemedText } from './ThemedText'
import { TextType } from '@/src/types/text'
import { useEffect, useState, type ReactElement } from 'react'
import { BackgroundColor, BrandColor, NeutralColor, TextColor } from '@/src/constants/Colors'
import { hexToRgb } from '@/src/utils/convert'
import { TextInput } from 'react-native-gesture-handler'
import { Pressable } from 'react-native'

export enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export enum ButtonSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum ButtonState {
  Normal = 'normal',
  Disabled = 'disabled',
  Hover = 'hover',
}

export type InputProps = TextInputProps & {
  label?: string
  error?: boolean
  errorMessage?: string
  textColor?: string
  isSecure?: boolean
  buttonLeft?: () => ReactElement
  buttonRight?: () => ReactElement
  validationOptions?: {
    required?: [boolean, string]
    minLength?: [number, string]
    maxLength?: [number, string]
    pattern?: [RegExp, string]
  }
  validate?: (isValid: boolean) => void
}

const screenWidth = Dimensions.get('window').width

const Input = ({
  style,
  label,
  placeholder,
  textColor = BrandColor.Blue[600],
  isSecure,
  error,
  errorMessage,
  value,
  onChangeText,
  validate,
  ...rest
}: InputProps) => {
  const [state, setState] = useState<'normal' | 'focused' | 'typing' | 'error'>('normal')
  const [message, setMessage] = useState<string>('')
  const [text, setText] = useState<string>('')
  useEffect(() => {
    if (error && errorMessage) {
      setState(error ? 'error' : 'normal')
      setMessage(errorMessage)
    }
  }, [error])

  const onValidate = (text: string) => {
    if (rest.validationOptions?.required && text.trim() === '') {
      setState('error')
      setMessage(rest.validationOptions.required[1])
      validate && validate(false)
      return
    }

    if (rest.validationOptions?.minLength && text.length < rest.validationOptions.minLength[0]) {
      setState('error')
      setMessage(rest.validationOptions.minLength[1])
      validate && validate(false)
      return
    }

    if (rest.validationOptions?.maxLength && text.length > rest.validationOptions.maxLength[0]) {
      setState('error')
      setMessage(rest.validationOptions.maxLength[1])
      validate && validate(false)

      return
    }

    if (rest.validationOptions?.pattern && !rest.validationOptions.pattern[0].test(text)) {
      setState('error')
      setMessage(rest.validationOptions.pattern[1])
      validate && validate(false)
      return
    }
    setState('normal')
    setMessage('')
    validate && validate(true)
  }

  const onEndEditingHandler = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    onValidate(e.nativeEvent.text)
  }

  const onFocusHandler = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setState((prev) => (prev !== 'error' ? rest?.editable ? 'focused' : 'normal' : 'error'))
  }

  const onChangeTextHandler = (text: string) => {
    onChangeText && onChangeText(text)
    onValidate(text)
    setText(text)
    setState((prev) => (prev !== 'error' ? 'typing' : 'error'))
  }

  return (
    <Pressable style={[styles.layout, styles[state]]} onPress={() => setState('focused')}>
      {rest.buttonLeft && rest.buttonLeft()}
      <ThemedText type={TextType.FootnoteSemibold} color={TextColor.Primary} style={styles.label}>
        {label}
      </ThemedText>
      <TextInput
        placeholder={placeholder}
        value={value}
        placeholderTextColor={TextColor.Placeholder}
        style={[styles.input]}
        cursorColor={BrandColor.PrimaryColor[400]}
        secureTextEntry={isSecure}
        onFocus={onFocusHandler}
        onEndEditing={onEndEditingHandler}
        autoFocus={state === 'focused'}
        onChangeText={onChangeTextHandler}
        readOnly={rest.editable === false}
      />
      {rest.buttonRight && rest.buttonRight()}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          top: 54,
          left: 12,
          justifyContent: 'flex-end',
        }}
      >
        <Text style={styles.errorMsg}>{message}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    width: screenWidth - 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColor.Gray[300],
  },
  input: {
    flex: 8,
    paddingVertical: 14,
  },
  normal: {
    borderColor: BrandColor.Gray[200],
    backgroundColor: BackgroundColor.LightTheme.Primary,
  },
  error: {
    borderColor: BrandColor.Red[400],
    backgroundColor: BrandColor.Red[100],
  },
  typing: {
    borderColor: BrandColor.Blue[600],
    backgroundColor: BackgroundColor.LightTheme.Tertiary,
  },
  focused: {
    borderColor: BrandColor.Blue[600],
    backgroundColor: BackgroundColor.LightTheme.Tertiary,
  },
  label: {
    position: 'absolute',
    top: -22,
    width: '100%',
    left: 0,
  },
  errorMsg: {
    color: BrandColor.Red[400],
  },
})
export default Input
