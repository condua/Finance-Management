import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BrandColor, NeutralColor } from "@/src/constants/Colors";
import { Pressable } from "react-native";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import {
  useGetAllWalletsQuery,
  useGetWalletByIdQuery,
} from "@/src/features/wallet/wallet.service";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useLocale } from "@/src/hooks/useLocale";
import { useNavigate } from "react-router-native";
import { useRouter } from "expo-router";
import { setDefaultWallet } from "@/src/features/auth/authSlice";

export const CustomAlertModal = ({ isVisible, onClose, title, message }) => {
  const { t } = useLocale();

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.alertContainer}>
        <Icon name="error-outline" size={50} color="red" />
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>{t("alerts.close")}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { t } = useLocale();
  const { walletId } = useAppSelector((state) => state.auth);
  const userId = useAppSelector((state) => state.auth.user._id);
  const wallet = useGetWalletByIdQuery({ walletId });
  const admins = wallet?.currentData?.admins;
  const owner = wallet?.currentData?.owner;
  const walletType = wallet?.currentData?.type;
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: allWallets, isLoading } = useGetAllWalletsQuery();
  const [isAlertVisible, setAlertVisible] = useState(false);

  const privateWallets =
    allWallets?.filter((wallet) => wallet.type === "private") || [];
  const [hasShownAlert, setHasShownAlert] = useState(false); // Trạng thái kiểm soát thông báo
  // const handleSelectWallet = (_id: string) => {
  //   if (walletId === _id) return;
  //   dispatch(setDefaultWallet(_id));
  //   router.push("/(authenticated)/(tabs)/home");
  //   return;
  // };

  // if (!wallet?.currentData && !hasShownAlert) {
  //   setHasShownAlert(true);
  //   Alert.alert(
  //     "Thông báo",
  //     "Ví của bạn không còn tồn tại. Chuyển đến trang ví.",
  //     [
  //       {
  //         text: "OK",
  //         onPress: () => {
  //           handleSelectWallet(privateWallets[0]?._id);
  //           router.push("/(authenticated)/(tabs)/wallet");
  //         },
  //       },
  //     ]
  //   );
  // }

  const hideTabs = useMemo(() => {
    for (let route of state.routes) {
      const { options } = descriptors[route.key];
      if (
        JSON.stringify(options.tabBarStyle) ===
        JSON.stringify({ display: "none" })
      ) {
        return true;
      }
    }
  }, [state]);

  return (
    <View
      style={[
        styles.tabBarContainer,
        { bottom: bottom },
        hideTabs ? { display: "none" } : { display: "flex" },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        // remove +not-found or _sitemap from tabs
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          // console.log(route.name);
          if (route.name === "transaction") {
            if (
              walletType === "shared" &&
              (owner !== userId || admins.includes(userId))
            ) {
              setAlertVisible(true);
              return;
            } else {
              navigation.navigate(route.name, route.params);
            }
          }
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabBarItem]}
            key={route.name}
          >
            {options.tabBarIcon &&
              options.tabBarIcon({
                size: 24,
                focused: isFocused,
                color: BrandColor.PrimaryColor[400],
              })}
            {!!options.tabBarLabel && (
              <Text
                style={[
                  styles.tabBarLabel,
                  {
                    color: isFocused
                      ? BrandColor.PrimaryColor[400]
                      : BrandColor.Gray[400],
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
              >
                {label.toString()}
              </Text>
            )}
          </Pressable>
        );
      })}
      <CustomAlertModal
        isVisible={isAlertVisible}
        onClose={() => setAlertVisible(false)}
        title={t("alerts.notification")}
        message={t("alerts.create")}
      />
    </View>
  );
}
export default TabBar;

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: NeutralColor.White[50],
    gap: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: BrandColor.Gray[100],
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    marginTop: 10,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
