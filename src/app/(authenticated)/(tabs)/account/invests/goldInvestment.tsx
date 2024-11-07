import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";

type Props = {};

const GoldInvestment = (props: Props) => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "http://giavang.doji.vn/" }} />
    </View>
  );
};

export default GoldInvestment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
