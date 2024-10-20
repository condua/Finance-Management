import i18next from 'i18next'
import React, { createContext, useEffect, useState } from 'react'
import { StorageService } from '@/src/services/storage.service'
import { getLocales, getCurrencies } from 'react-native-localize'
const USER_LANGUAGE_KEY = 'USER_LANGUAGE'
const USER_CURRENCY_KEY = 'USER_CURRENCY'
const USER_LANGUAGE_TAG_KEY = 'USER_LANGUAGE_TAG'



export const LocalizationContext = createContext({
  languageCode: i18next.language,
  changeLanguage: (_lng: string) => {},
  currencyCode: getCurrencies()[0],
  changeCurrency: (_currency: string) => {},
  // languageTag: getLocales()[0].languageTag,
  // changeLanguageTag: (_locale: string) => {},
})

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [languageCode, setLanguageCode] = useState<string>(i18next.language)
  const [currencyCode, setCurrencyCode] = useState<string>(getCurrencies()[0])
  // const [languageTag, setLanguageTag] = useState<string>(getLocales()[0].languageTag)


  const changeLanguage = async (lng: string) => {
    setLanguageCode(lng)
    i18next.changeLanguage(lng)
    await StorageService.setItem(USER_LANGUAGE_KEY, lng)
  }

  const changeCurrency = async (currency: string) => {
    setCurrencyCode(currency)
    await StorageService.setItem(USER_CURRENCY_KEY, currency)
  }

  // const changeLanguageTag = async (languageTag: string) => {
  //   setLanguageTag(languageTag)
  //   await StorageService.setItem(USER_LANGUAGE_TAG_KEY, languageTag)
  // }

  useEffect(() => {
    const getUserLocale = async () => {
      const userLocale = await StorageService.getMultipleItems([
        USER_LANGUAGE_KEY,
        USER_CURRENCY_KEY,
        USER_LANGUAGE_TAG_KEY,
      ]) 
      if (Array.isArray(userLocale)) {
        if(userLocale[0]) {

          setLanguageCode(userLocale[0])
        }
        if(userLocale[1]) {
          setCurrencyCode(userLocale[1])
        }
        // if(userLocale[2]) {
        //   setLanguageTag(userLocale[2])
        // }
        i18next.changeLanguage(userLocale[0])
      }
    }
    getUserLocale()
  }, [])

  return (
    <LocalizationContext.Provider
      value={{
        languageCode,
        currencyCode,
        changeCurrency,
        changeLanguage,
        // languageTag,
        // changeLanguageTag
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}
