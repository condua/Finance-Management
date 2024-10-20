import { t } from "i18next";
import { createContext, useEffect, useState } from "react";
import { StorageService } from '@/src/services/storage.service'


interface StyleMoneyLabel  {
  shortenAmount: boolean
  showCurrency: boolean
  disableDecimal: boolean
  decimalSeparator: string
  groupSeparator: string

}

export const SettingsContext = createContext({
  timeFormat: 'dd/mm/yyyy',
  changeTimeFormat: (_format: string) => {},
  firstDayOfWeek: 0,
  changeFirstDayOfWeek: (_day: number) => {},
  dailyReminder: false,
  toggleDailyReminder: () => {},
  dailyReminderTime: '08:00',
  setDailyReminderTime: (_time: string) => {},
  PIN: '',
  setPIN: (_pin: string) => {},
  styleMoneyLabel: {
    shortenAmount: false,
    showCurrency: true,
    disableDecimal: false,
    decimalSeparator: '.',
    groupSeparator: ',',
  },
  changeStyleMoneyLabel: (_style: any) => {},
})
const USER_STYLES = 'USER_STYLES'

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeFormat, setTimeFormat] = useState('dd/mm/yyyy');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [dailyReminderTime, setDailyReminderTime] = useState('08:00');
  const [PIN, setPIN] = useState('');
  const [styleMoneyLabel, setStyleMoneyLabel] = useState({
    shortenAmount: false,
    showCurrency: true,
    disableDecimal: false,
    decimalSeparator: '.',
    groupSeparator: ',',
  });

  const changeStyleMoneyLabel = async (styles: StyleMoneyLabel) => {
    setStyleMoneyLabel({...styles})
    await StorageService.setItem(USER_STYLES, styles)
  }

  const changeTimeFormat = (format: string) => {
    setTimeFormat(format);
  }

  const changeFirstDayOfWeek = (day: number) => {
    setFirstDayOfWeek(day);
  }

  const toggleDailyReminder = () => {
    setDailyReminder((prev) => !prev);
  }


  useEffect(() => {
    const getUserSettings = async () => {
      const settings = await StorageService.getItem(USER_STYLES)
      if(settings) setStyleMoneyLabel({ ...settings })
    }
    getUserSettings()
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        timeFormat,
        changeTimeFormat,
        firstDayOfWeek,
        changeFirstDayOfWeek,
        dailyReminder,
        toggleDailyReminder,
        dailyReminderTime,
        setDailyReminderTime,
        PIN,
        setPIN,
        styleMoneyLabel,
        changeStyleMoneyLabel,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}