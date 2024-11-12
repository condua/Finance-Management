import { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { ChevronLeft } from "react-native-feather";
import { Provider } from "react-redux";
import { persistor } from "@/src/store/store";
const { store } = require("@/src/store/store");
import { PersistGate } from "redux-persist/integration/react";
import { useSegments } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import "intl-pluralrules";
import "@/src/utils/i18n";
import Toast from "react-native-toast-message";

import { LocalizationProvider } from "@/src/contexts/LocalizationContext";
import { SettingsProvider } from "@/src/contexts/SettingsContext";
import { useNetInfo } from "@react-native-community/netinfo";

const InitialLayout = () => {
  const router = useRouter();
  const segment = useSegments();
  const { walletId } = useAppSelector((state) => state.auth);
  const { isAuthenticated } = useAppSelector((state) => state.auth) || false;

  const netInfo = useNetInfo();
  // console.log('netInfo', netInfo)
  useEffect(() => {
    if (isAuthenticated && !Boolean(walletId)) {
      router.replace("/(authenticated)/first-wallet");
    } else if (
      isAuthenticated &&
      Boolean(walletId) &&
      segment[1] !== "(tabs)"
    ) {
      router.replace("/(authenticated)/(tabs)/home");
    } else if (!isAuthenticated) {
      router.replace("/login");
    }
    console.log(isAuthenticated);
  }, [isAuthenticated, walletId]);

  return (
    <Stack>
      <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
      {/* <Stack.Screen name='index' options={{ headerShown: false }} /> */}
      <Stack.Screen
        name="register"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft width={24} height={24} />
            </TouchableOpacity>
          ),
          title: "",
          headerShadowVisible: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft width={24} height={24} />
            </TouchableOpacity>
          ),
          title: "",
          headerShadowVisible: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft width={24} height={24} />
            </TouchableOpacity>
          ),
          title: "",
          headerShadowVisible: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

const RootLayoutNav = () => {
  return (
    <ActionSheetProvider>
      <Provider store={store}>
        {/* <> */}
        <SettingsProvider>
          <LocalizationProvider>
            <StatusBar style="dark" backgroundColor={"white"} />
            <GestureHandlerRootView style={{ flex: 1 }}>
              <PersistGate persistor={persistor}>
                <InitialLayout />
                <Toast />
              </PersistGate>
            </GestureHandlerRootView>
            {/* </> */}
          </LocalizationProvider>
        </SettingsProvider>
      </Provider>
    </ActionSheetProvider>
  );
};

export default RootLayoutNav;
