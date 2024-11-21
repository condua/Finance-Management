import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";

type Props = {};

const Stock = (props: Props) => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://banggia.dag.vn/HOSE-IDX?lang=vi" }}
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always" // Allow mixed content for insecure SSL
      />
    </View>
  );
};

export default Stock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
