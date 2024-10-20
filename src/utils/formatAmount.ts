// Create our number formatter.
import { codes } from '@/src/constants/Currency'

type CurrencyCode = (typeof codes)[number]

export const formatter = (number: number, currencyCode: CurrencyCode): string =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currencyCode ,
    maximumFractionDigits: 0,
  }).format(number)

// convert formatted number back to number
export const numberString = (formattedNumber: string): number => {
  return Number(formattedNumber.replace(/[^0-9.-]+/g, ''))
}

// convert currency code to symbol
export const currencySymbol = (currencyCode: CurrencyCode): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currencyCode,
  })
    .format(0)
    .replace(/[^$€¥£]/g, '')
}
