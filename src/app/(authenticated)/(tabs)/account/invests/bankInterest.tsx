import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";

type Props = {};

const BankInterest = (props: Props) => {
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: "https://techcombank.com/thong-tin/blog/lai-suat-tiet-kiem",
        }}
      />
    </View>
  );
};

export default BankInterest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
