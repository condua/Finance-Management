import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  type TouchableOpacityProps,
  type ViewProps,
  ViewStyle,
  DimensionValue,
} from 'react-native'
import { ThemedText } from '@/src/components/ThemedText'
import { TextType } from '@/src/types/text'
import { useMemo, type ReactElement } from 'react'
import { BrandColor, NeutralColor } from '@/src/constants/Colors'
import { hexToRgb } from '@/src/utils/convert'
import { ActivityIndicator } from 'react-native'

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

export type ButtonProps = TouchableOpacityProps & {
  text: string
  textColor?: string
  isLoading?: boolean
  type: 'primary' | 'secondary' | 'tertiary'
  size: 'small' | 'medium' | 'large'
  state: 'normal' | 'disabled' | 'hover'
  buttonLeft?: () => ReactElement
  buttonRight?: () => ReactElement
  onPress: () => void
}

const screenWidth = Dimensions.get('window').width

const Button = ({
  style,
  text,
  textColor = BrandColor.Blue[600],
  type,
  size,
  state = ButtonState.Normal,
  isLoading,
  onPress,
  ...rest
}: ButtonProps) => {

  const btnWidth = useMemo(() => {
    if (style) {
      return `${parseFloat(style['width']) / 100}` as DimensionValue
    }
  }, [style])
  

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={state === ButtonState.Disabled || isLoading}
      style={[
        styles.layout,
        styles[type],
        { minHeight: size === ButtonSize.Small ? 38 : size === ButtonSize.Medium ? 44 : 54 },
        { borderWidth: state === ButtonState.Hover ? 2 : type === ButtonType.Tertiary ? 2 : 0 }, // if state is hover, add border
        {
          borderColor:
            type === ButtonType.Primary
              ? `rgba(${hexToRgb(BrandColor.Blue[600])}, 0.5)`
              : type === ButtonType.Secondary
              ? `rgba(${hexToRgb(BrandColor.Blue[600])}, 0.7)`
              : state === ButtonState.Hover
              ? `rgba(${hexToRgb(textColor)}, 0.3)`
              : BrandColor.Gray[200], // if state is hover, add border color except for tertiary without hover state (default is gray)
        },
        { opacity: (state === ButtonState.Disabled || isLoading) ? 0.4 : 1 },
        style,
      ]}
      {...rest}
    >
      {isLoading && <ActivityIndicator style={[styles.indicator, btnWidth ? {left: btnWidth }: undefined]} />}

      {rest.buttonLeft && rest.buttonLeft()}
      <ThemedText
        color={
          type === ButtonType.Primary
            ? NeutralColor.White[50]
            : type === ButtonType.Secondary
            ? BrandColor.Blue[600]
            : textColor
        }
        type={TextType.CalloutSemibold}
      >
        {text}
      </ThemedText>
      {rest.buttonRight && rest.buttonRight()}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth - 48,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primary: {
    backgroundColor: BrandColor.Blue[600],
  },
  secondary: {
    backgroundColor: `rgba(${hexToRgb(BrandColor.Blue[600])}, 0.15)`,
  },
  tertiary: {
    backgroundColor: NeutralColor.White[50],
    borderWidth: 2,
    borderColor: BrandColor.Gray[200],
  },
  indicator: {
    position: 'absolute',
    left: screenWidth/2 -24,
  },
})
export default Button
