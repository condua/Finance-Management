import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";

type Props = {};

const Stock = (props: Props) => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "https://prs.tvsi.com.vn/" }} />
    </View>
  );
};

export default Stock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
