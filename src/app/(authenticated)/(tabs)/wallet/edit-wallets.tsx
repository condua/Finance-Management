import Button from "@/src/components/buttons/Button";
import Loading from "@/src/components/Loading";
import Header from "@/src/components/navigation/Header";
import HeaderButton from "@/src/components/navigation/HeaderButton";
import WalletItem from "@/src/components/WalletItem";
import { BackgroundColor, TextColor } from "@/src/constants/Colors";
import { useGetAllWalletsQuery } from "@/src/features/wallet/wallet.service";
import { useAppSelector } from "@/src/hooks/hooks";
import { useLocale } from "@/src/hooks/useLocale";
import { AntDesign } from "@expo/vector-icons";
import { Href, Stack } from "expo-router";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Page = () => {
  const router = useRouter();
  const { t } = useLocale();

  const { walletId } = useAppSelector((state) => state.auth);
  const getAllWallets = useGetAllWalletsQuery();

  // Phân loại wallets theo type
  const privateWallets =
    getAllWallets.data?.filter((wallet) => wallet.type === "private") || [];
  const sharedWallets =
    getAllWallets.data?.filter((wallet) => wallet.type === "shared") || [];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t("wallets.editwallets"),
          header: (props) => (
            <Header
              {...props}
              headerLeft={() => (
                <HeaderButton
                  type="btn"
                  onPress={() => {
                    router.back();
                  }}
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
      <Loading isLoading={getAllWallets.isLoading} text="Loading..." />
      <View style={{ marginTop: 40, gap: 20 }}>
        {/* Hiển thị Private Wallets */}
        <Text style={styles.sectionTitle}>{t("wallets.private")}</Text>
        {privateWallets.map((wallet) => (
          <TouchableOpacity
            key={wallet._id}
            onPress={() =>
              router.navigate({
                pathname: "/(authenticated)/(tabs)/wallet/edit-wallet",
                params: { id: wallet._id },
              })
            }
          >
            <WalletItem
              name={wallet.name}
              balance={wallet.balance}
              icon={wallet.icon}
              key={wallet._id}
              isDefault={false}
            />
          </TouchableOpacity>
        ))}

        {/* Hiển thị Shared Wallets */}
        <Text style={styles.sectionTitle}>{t("wallets.shared")}</Text>
        {sharedWallets.map((wallet) => (
          <TouchableOpacity
            key={wallet._id}
            onPress={() =>
              router.navigate({
                pathname: "/(authenticated)/(tabs)/wallet/edit-wallet",
                params: { id: wallet._id },
              })
            }
          >
            <WalletItem
              name={wallet.name}
              balance={wallet.balance}
              icon={wallet.icon}
              key={wallet._id}
              isDefault={false}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: TextColor.Primary,
    marginBottom: 10,
  },
});
