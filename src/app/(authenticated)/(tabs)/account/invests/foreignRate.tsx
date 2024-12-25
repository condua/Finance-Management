import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";

type Props = {};

const ForeignRate = (props: Props) => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "https://www.agribank.com.vn/vn/ty-gia" }} />
    </View>
  );
};

export default ForeignRate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
