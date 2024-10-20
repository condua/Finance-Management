import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'react-native-localize'

const getLanguage = () => {
  const locales = getLocales()
  return locales[0].languageCode
}

const resources = {
  en: {
    translation: require('@/src/utils/i18n/locales/en/en.json'),
  },
  vi: {
    translation: require('@/src/utils/i18n/locales/vi/vi.json'),
  },
}

i18next.use(initReactI18next).init({
  resources,
  lng: getLanguage(),
  fallbackLng: 'en',
  // compabilityJSON: 'v3',
  interpolation: {
    escapeValue: false
  },
  
})


export default i18next