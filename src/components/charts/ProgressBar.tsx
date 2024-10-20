import { StyleSheet, Text, View, ViewProps } from 'react-native'

type ProgressBarProps = ViewProps & {
  progress: number
  activeColor: string
  inactiveColor: string
  width: number
  height: number
}

const ProgressBar = ({ progress, activeColor, inactiveColor, width, height }: ProgressBarProps) => {
  return (
    <View style={[styles.outer, { backgroundColor: inactiveColor, height,  }]}>
      <View style={[styles.inner, { backgroundColor: activeColor, height, width }]}></View>
    </View>
  )
}
export default ProgressBar
const styles = StyleSheet.create({
 outer: {
   borderRadius: 12,
 },
 inner: {
  borderRadius: 12,
 },
})