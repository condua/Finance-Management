import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native'

import { Colors } from '@/src/constants/Colors'

interface LoadingProps {
  isLoading: boolean
  text: string
}

const Loading = (props: LoadingProps) => {
  const {height, width} = useWindowDimensions()
  return (
    <>
      {props.isLoading && (
        <View style={[StyleSheet.absoluteFill, styles.loading, {width, height}]}>
          <ActivityIndicator size='large' color={Colors.primary} />
          <Text style={{ fontSize: 18, padding: 10 }}>{props.text}</Text>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: '#383737',
    opacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Loading
