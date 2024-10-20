import { BackgroundColor, BrandColor } from '@/src/constants/Colors'
import { useLocale } from '@/src/hooks/useLocale'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { abbrValue } from 'react-native-currency-input-fields'
import { BarChart } from 'react-native-gifted-charts'

interface DataGroupedBarChart {
  value: number
  label?: string
  spacing?: number
  labelWidth?: number
  labelTextStyle?: object
  frontColor: string
}

interface GroupedBarsProps {
  data: DataGroupedBarChart[]
}

const GroupedBars = ({ data }: GroupedBarsProps) => {
  const { t } = useLocale()
  

  const renderTitle = () => {
    return (
      <View style={{ marginVertical: 16 }}>
        <View style={styles.note}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.type, { backgroundColor: BrandColor.Red[300] }]} />
            <Text style={styles.typeText}>{t('analytics.expense')}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.type, { backgroundColor: BrandColor.PrimaryColor[400] }]} />
            <Text style={styles.typeText}>{t('analytics.income')}</Text>
          </View>
        </View>
      </View>
    )
  }
  const index = new Date().getMonth()
 
  return (
    <View style={styles.container}>
      {renderTitle()}
      <BarChart
        height={250}
        data={data}
        barWidth={data.length < 10 ? 24 :17}
        spacing={16}
        barBorderRadius={4}
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: BrandColor.Gray[600], fontSize: 13 }}
        formatYLabel={(value) => {
          const roundedDigits = Math.pow(10, value.length - 2)
          const newValue = Math.round(Number(value) / roundedDigits) * roundedDigits
          return abbrValue(newValue, '.', 2)
        }}
        isAnimated
        noOfSections={3}
        scrollToIndex={data.length > 16 ? index*2 : 0}
        renderTooltip={(item: DataGroupedBarChart, index: number) => {
          const roundedDigits = Math.pow(10, Math.floor(Math.log10(item.value)) - 3)
          const newValue = Math.round(item.value / roundedDigits) * roundedDigits
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={{ fontSize: 10, textAlign: 'center' }}
              >
                {!!newValue && abbrValue(newValue, '.', 2)}
              </Text>
            </View>
          )
        }}
      />
    </View>
  )
}

export default GroupedBars

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundColor.LightTheme.Primary,
    paddingBottom: 14,
    borderRadius: 12,
  },
  type: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#177AD5',
    marginRight: 8,
  },
  typeText: {
    width: 60,
    height: 16,
    color: 'lightgray',
  },
  note: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})
