import { View, Text, Pressable, Button, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ChevronLeft, FolderPlus } from "react-native-feather";
import { Colors, NeutralColor, TextColor } from "@/src/constants/Colors";
import { useLocale } from "@/src/hooks/useLocale";
import Header from "@/src/components/navigation/Header";
import HeaderButton from "@/src/components/navigation/HeaderButton";
import { AntDesign } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
const Layout = () => {
  const router = useRouter();
  const { t } = useLocale();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="chat"
        options={{
          title: `${t("titles.chat")}`,
        }}
      />
      <Stack.Screen
        name="members"
        options={{
          title: `${t("titles.member")}`,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                router.navigate("/(authenticated)/(tabs)/home/searchMember");
              }}
            >
              <Text style={{ color: "blue", fontSize: 20 }}>Thêm</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="searchMember"
        options={{
          title: `Thêm thành viên`,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: `Lời mời vào nhóm`,
        }}
      />
      <Stack.Screen
        name="history"
        options={{ title: "History", animation: "fade_from_bottom" }}
      />
      {/* <Stack.Screen name='first-wallet' options={{ title: 'Create new wallet', headerBackVisible: false }} /> */}
      <Stack.Screen name="categories-analytics" />
    </Stack>
  );
};
export default Layout;
