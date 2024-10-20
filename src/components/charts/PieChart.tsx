import { BackgroundColor, BrandColor, TextColor } from '@/src/constants/Colors'
import { View, StyleSheet, Text } from 'react-native'
import { PieChart, pieDataItem } from 'react-native-gifted-charts'
import { ThemedText } from '../ThemedText'
import { TextType } from '@/src/types/text'
import { useLocale } from '@/src/hooks/useLocale'
import { isDefaultCategory } from '@/src/utils/isDefaultCategory'
import { Alert } from 'react-native'

interface PieData {
  value: number
  color: string
  gradientCenterColor: string
  focused?: boolean
  text?: string,
  id?: string,
}

interface CustomPieChartProps {
  data: PieData[]
}

const CustomPieChart = ({ data }: CustomPieChartProps) => {
  const {t} = useLocale()
  const renderDot = (color?: string) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    )
  }

  const renderLegendComponent = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {data.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: 120,
                }}
                key={index}
              >
                {renderDot(item.color)}
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={TextColor.Primary}
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                >
                  {isDefaultCategory(item.text!)
                    ? t(`categories.${item.text}`)
                    : item.text}
                </ThemedText>
              </View>
            )
          })}
        </View>
      </>
    )
  }

  return (
    <View
      style={{
        marginHorizontal: 20,
        borderRadius: 20,
        backgroundColor: BackgroundColor.LightTheme.Primary,
      }}
    >
      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Performance</Text>
      <View style={{ padding: 20, alignItems: 'center' }}>
        <PieChart
          data={data}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          onPress={(item: PieData, index:number) => {
            console.log(item)
          }
          }
          innerCircleColor={BackgroundColor.LightTheme.Primary}
          centerLabelComponent={() => {
            return (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText type={TextType.Title22Bold} color={TextColor.Primary}>
                  {data[0]?.value}%
                </ThemedText>
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={TextColor.Secondary}
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                >
                  {isDefaultCategory(data[0]?.text!)
                    ? t(`categories.${data[0]?.text}`)
                    : data[0]?.text}
                </ThemedText>
              </View>
            )
          }}
        />
      </View>
      {renderLegendComponent()}
    </View>
  )
}

export default CustomPieChart

const styles = StyleSheet.create({})
