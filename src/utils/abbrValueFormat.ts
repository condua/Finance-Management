import { abbrValue } from "react-native-currency-input-fields"
import { getCurrencySymbol } from "./getCurrencySymbol"
import { useLocale } from "@/src/hooks/useLocale"


export const abbrValueFormat = (value: number, showCurrency?: boolean, currencyCode?: string) => {
 if (!value) return `0 ${showCurrency ? getCurrencySymbol(currencyCode ?? 'VND') : ''}`
 const roundedDigits = Math.pow(10, Math.floor(Math.log10(Math.abs(value))) - 3)
 const newValue = Math.round(Math.abs(value) / roundedDigits) * roundedDigits

 return `${value<0 ? '-' : ''}${abbrValue(newValue, '.', 2)} ${showCurrency ? getCurrencySymbol(currencyCode ?? 'VND') : ''}`
}