import { View, Text, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ChevronLeft, FolderPlus } from "react-native-feather";
import { Colors, NeutralColor, TextColor } from "@/src/constants/Colors";
import { useLocale } from "@/src/hooks/useLocale";
import Header from "@/src/components/navigation/Header";
import HeaderButton from "@/src/components/navigation/HeaderButton";
import { AntDesign } from "@expo/vector-icons";

const Layout = () => {
  const router = useRouter();
  const { t } = useLocale();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="chat" options={{ title: "Group Chat" }} />
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
