import { useLocale } from "@/src/hooks/useLocale";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
const Layout = () => {
  const { t } = useLocale();
  return (
    <Stack
      screenOptions={{
        // headerStyle: {
        //   backgroundColor: "#f4511e",
        // },
        // headerTintColor: "#fff",
        // headerTitleStyle: {
        //   fontWeight: "bold",
        // },
        headerShown: true,
      }}
    >
      <Stack.Screen name="index" options={{ title: t("titles.invest") }} />
      <Stack.Screen
        name="goldInvestment" // tên phải khớp với đường dẫn
        options={{ title: t("investments.gold") }}
      />
      <Stack.Screen
        name="currencyInvestment" // tên phải khớp với đường dẫn
        options={{ title: t("investments.crypto") }}
      />
      <Stack.Screen
        name="petroInvestment" // tên phải khớp với đường dẫn
        options={{ title: t("investments.petro") }}
      />
      <Stack.Screen
        name="foreignRate" // tên phải khớp với đường dẫn
        options={{ title: t("investments.foreign") }}
      />
      <Stack.Screen
        name="bankInterest" // tên phải khớp với đường dẫn
        options={{ title: t("investments.bank") }}
      />
    </Stack>
  );
};
export default Layout;
