import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";

type Props = {};

const PetroInvestment = (props: Props) => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "https://www.pvoil.com.vn/tin-gia-xang-dau" }} />
    </View>
  );
};

export default PetroInvestment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
