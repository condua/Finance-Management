import { StyleSheet, Text, View } from 'react-native'
import { BrandColor } from '@/src/constants/Colors'
import { BarChart } from 'react-native-gifted-charts'
import { formatValue, abbrValue } from 'react-native-currency-input-fields'
import { useLocale } from '@/src/hooks/useLocale'
import { useMemo, useState } from 'react'
import { set } from 'date-fns'


interface DataBarChart {
  value: number
  label: string
  frontColor?: string
}


interface BarChartProps {
  data: Array<DataBarChart>
}

const Bar = ({ data }: BarChartProps) => {
  const length = data.length
  const { currencyCode } = useLocale()
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  // const barChartData = useMemo(() => {
  //  data[selectedIndex].frontColor = BrandColor.PrimaryColor[400]
  //  return data
  // }, [selectedIndex])
  return (
    <View>
      <BarChart
        height={250}
        barWidth={166/length}
        noOfSections={3}
        frontColor={BrandColor.PrimaryColor[400]}
        barBorderRadius={4}
        data={data}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelWidth={18}
        formatYLabel={(value) => {
          const roundedDigits = Math.pow(10, value.length - 2)
          const newValue = Math.round(Number(value) / roundedDigits) * roundedDigits
          return abbrValue(newValue, '.', 2)
        }}
        yAxisTextStyle={{ color: BrandColor.Gray[600], fontSize: 12 }}
        xAxisLabelTextStyle={{ color: BrandColor.Gray[600], fontSize: 12 }}
        yAxisLabelContainerStyle={{ width: 36,justifyContent: 'flex-start' }}
        isAnimated
        hideRules
        // showReferenceLine1={selectedIndex !== undefined}
        // referenceLine1Position={barChartData[selectedIndex ?? 0].value}
        // referenceLine1Config={{
        //   color: BrandColor.PrimaryColor[400],
        //   dashWidth: 6,
        //   dashGap: 10,
        //   labelText: `${barChartData[selectedIndex ?? 0].value}`,
        //   labelTextStyle: {
        //     top: -20,
        //     right: 40,
        //     color: BrandColor.PrimaryColor[400],
        //   },
        // }}
        // renderTooltip={(item, index) => {
        //   setSelectedIndex(index)
        // }}

        renderTooltip={(item: DataBarChart, index: number) => {
          const roundedDigits = Math.pow(10, Math.floor(Math.log10(item.value)) - 3)
          const newValue = Math.round(item.value / roundedDigits) * roundedDigits
          console.log(newValue)
          return (
            <View
              style={
                {
                  // marginBottom: 20,
                  // marginLeft: -6,
                  // backgroundColor: '#ffcefe',
                  // paddingHorizontal: 6,
                  // paddingVertical: 4,
                  // borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              }
            >
              <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ fontSize: 12, textAlign:'center' }}>
                {!!newValue && abbrValue(newValue, '.', 2)}
              </Text>
            </View>
          )
        }}
      />
    </View>
  )
}
export default Bar
const styles = StyleSheet.create({})
