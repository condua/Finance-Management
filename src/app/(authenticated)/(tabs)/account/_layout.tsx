import Header from "@/src/components/navigation/Header";
import HeaderButton from "@/src/components/navigation/HeaderButton";
import { Colors, TextColor } from "@/src/constants/Colors";
import { useLocale } from "@/src/hooks/useLocale";
import { AntDesign } from "@expo/vector-icons";
import { Link, Stack, useRouter, useSegments } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { ChevronLeft } from "react-native-feather";

const Layout = () => {
  const router = useRouter();
  const { t } = useLocale();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: t("settings.title"),
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  onPress={() => router.back()}
                  type="btn"
                  button={() => (
                    <AntDesign
                      name="arrowleft"
                      size={24}
                      color={TextColor.Primary}
                    />
                  )}
                />
              )}
            />
          ),
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: t("settings.editaccount"),
          presentation: "modal",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="languages"
        options={{
          headerTitle: t("settings.selectlanguage"),
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  onPress={() => router.back()}
                  type="btn"
                  button={() => (
                    <AntDesign
                      name="arrowleft"
                      size={24}
                      color={TextColor.Primary}
                    />
                  )}
                />
              )}
            />
          ),
          // animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="currencies"
        options={{
          headerTitle: t("settings.choosecurrency"),
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  onPress={() => router.back()}
                  type="btn"
                  button={() => (
                    <AntDesign
                      name="arrowleft"
                      size={24}
                      color={TextColor.Primary}
                    />
                  )}
                />
              )}
            />
          ),
          // animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="goal" options={{ headerShown: false }} />
      <Stack.Screen name="category" options={{ headerShown: false }} />
      <Stack.Screen name="budget" options={{ headerShown: false }} />
      <Stack.Screen name="setting" options={{ headerShown: false }} />
      <Stack.Screen name="invests" options={{ headerShown: false }} />
    </Stack>
  );
};
export default Layout;
