import { TextType } from '@/src/types/text'
import { Text, type TextProps, StyleSheet } from 'react-native'

export type ThemedTextProps = TextProps & {
  color: string
  type?: TextType
}

export function ThemedText({ style, color, type = TextType.Default, ...rest }: ThemedTextProps) {
  return (
    <Text
      style={[{ color }, { letterSpacing: 0.5, flexWrap: 'nowrap' }, styles[type], style]}
      numberOfLines={1}
      {...rest}
      ellipsizeMode='tail'
      adjustsFontSizeToFit={true}
    />
  )
}

/* 
 font-weight: 400; // regular
 font-weight: 500; // medium
 font-weight: 600; // semibold
 font-weight: 700; // bold

*/

const styles = StyleSheet.create({
  default: {
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 22,
  },
  largeTitleBold: {
    fontWeight: '700',
    fontSize: 34,
    lineHeight: 41,
  },
  largeTitleRegular: {
    fontWeight: '400',
    fontSize: 34,
    lineHeight: 41,
  },
  title28Bold: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 34,
  },
  title28Regular: {
    fontWeight: '400',
    fontSize: 28,
    lineHeight: 34,
  },
  title22Bold: {
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 28,
  },
  title22Regular: {
    fontWeight: '400',
    fontSize: 22,
    lineHeight: 28,
  },
  title20Semibold: {
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 25,
  },
  title20Regular: {
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 25,
  },
  headlineBold: {
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 22,
  },
  headlineSemibold: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
  },
  headlineItalic: {
    fontStyle: 'italic',
    fontSize: 17,
    lineHeight: 22,
  },
  bodySemibold: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
  },
  bodyRegular: {
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 22,
  },
  bodySemiboldItalic: {
    fontWeight: '600',
    fontStyle: 'italic',
    fontSize: 17,
    lineHeight: 22,
  },
  bodyItalic: {
    fontStyle: 'italic',
    fontSize: 17,
    lineHeight: 22,
  },
  calloutSemibold: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 21,
  },
  calloutRegular: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 21,
  },
  calloutSemiboldItalic: {
    fontWeight: '600',
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 21,
  },
  calloutItalic: {
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 21,
  },
  subheadlineSemibold: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 20,
  },
  subheadlineBold: {
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
  },
  subheadlineRegular: {
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
  },
  subheadlineSemiboldItalic: {
    fontWeight: '600',
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 20,
  },
  subheadlineItalic: {
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 20,
  },
  footnoteSemibold: {
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18,
  },
  footnoteRegular: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
  },
  footnoteSemiboldItalic: {
    fontWeight: '600',
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 18,
  },
  footnoteItalic: {
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 18,
  },
  captionMedium: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
  },
  captionSemibold: {
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 13,
  },
  caption12Regular: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  },
  caption11Regular: {
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 13,
  },
  captionMediumItalic: {
    fontWeight: '500',
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 16,
  },
  captoinSemiboldItalic: {
    fontWeight: '600',
    fontStyle: 'italic',
    fontSize: 11,
    lineHeight: 13,
  },
  caption12Italic: {
    fontWeight: '400',
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 16,
  },
  caption11Italic: {
    fontWeight: '400',
    fontStyle: 'italic',
    fontSize: 11,
    lineHeight: 13,
  },
})
