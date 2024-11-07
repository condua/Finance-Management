import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";

type Props = {};

const CurrencyInvestment = (props: Props) => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "https://webgia.com/tien-ao" }} />
    </View>
  );
};

export default CurrencyInvestment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
