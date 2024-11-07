import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Colors, BrandColor } from "@/src/constants/Colors";
import { useLocale } from "@/src/hooks/useLocale";
const widthMax = Dimensions.get("window").width;

type Props = {};

const Index = (props: Props) => {
  const router = useRouter();
  const { t } = useLocale();

  const handleLink = (url: string) => {
    router.navigate(`/(authenticated)/(tabs)/account/invests/${url}`);
  };

  const buttons = [
    {
      id: "1",
      title: t("investments.gold"),
      url: "goldInvestment",
      color: BrandColor.Yellow[100],
      icon: require("../../../../../assets/icons/gold.png"),
    },
    {
      id: "2",
      title: t("investments.crypto"),
      url: "currencyInvestment",
      color: BrandColor.Orange[100],

      icon: require("../../../../../assets/icons/bitcoin.png"),
    },
    {
      id: "3",
      title: t("investments.petro"),
      url: "petroInvestment",
      color: BrandColor.Red[100],

      icon: require("../../../../../assets/icons/gas.png"),
    },
    {
      id: "4",
      title: t("investments.foreign"),
      url: "foreignRate",
      color: BrandColor.Green[200],

      icon: require("../../../../../assets/icons/money.png"),
    },
    {
      id: "5",
      title: t("investments.bank"),
      url: "bankInterest",
      color: BrandColor.Blue[100],

      icon: require("../../../../../assets/icons/bank.png"),
    },
    {
      id: "6",
      title: t("investments.stock"),
      url: "stock",
      color: BrandColor.Purple[400],

      icon: require("../../../../../assets/icons/stock.png"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={[styles.button, { backgroundColor: button.color }]}
            onPress={() => handleLink(button.url)}
          >
            <Image source={button.icon} style={styles.icon} />
            <Text style={styles.text}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: widthMax * 0.9,
  },
  button: {
    width: widthMax * 0.4,
    height: widthMax * 0.4,
    backgroundColor: BrandColor.Yellow[50],
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 17,
    color: "black",
  },
  icon: {
    width: 70, // Adjust width as needed
    height: 70, // Adjust height as needed
    marginBottom: 10,
  },
});
