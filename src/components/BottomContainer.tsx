import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { BackgroundColor, BrandColor } from '@/src/constants/Colors'






import { ReactNode } from 'react';

const BottomContainer = ({ children }: { children: ReactNode }) => {
  const { width } = useWindowDimensions()
  return <View style={[styles.container, { width }]}>{children}</View>
}
export default BottomContainer
const styles = StyleSheet.create({
  container : {
    flexDirection: 'row',
    height: 100,
    gap: 8,
    position: 'absolute',
    paddingHorizontal: 24,
    bottom: 0,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: BrandColor.Gray[100],
    borderTopWidth: 1,
    shadowColor: BrandColor.Gray[200],
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,

  }
})