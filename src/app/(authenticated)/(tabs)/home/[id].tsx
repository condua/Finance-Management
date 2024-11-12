import Button from "@/src/components/buttons/Button";
import Loading from "@/src/components/Loading";
import Header from "@/src/components/navigation/Header";
import HeaderButton from "@/src/components/navigation/HeaderButton";
import { ThemedText } from "@/src/components/ThemedText";
import { BackgroundColor, BrandColor, TextColor } from "@/src/constants/Colors";
import {
  useDeleteTransactionMutation,
  useGetTransactionByIdQuery,
} from "@/src/features/transaction/transaction.service";
import { useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import { useLocale } from "@/src/hooks/useLocale";
import { TextType } from "@/src/types/text";
import { formatter } from "@/src/utils/formatAmount";
import { format } from "date-fns";
import { getImg } from "@/src/utils/getImgFromUri";
import { AntDesign } from "@expo/vector-icons";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  Href,
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
  useSegments,
} from "expo-router";
import { Alert, Image } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { setEdit } from "@/src/features/transaction/transactionSlice";
import categoriesDefault from "@/src/constants/Categories";
import { formatValue } from "react-native-currency-input-fields";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import { useSettings } from "@/src/hooks/useSetting";
import { useGetWalletByIdQuery } from "@/src/features/wallet/wallet.service";
import { CustomAlertModal } from "@/src/components/navigation/TabBar";
import { useState } from "react";

const Page = () => {
  const { id } = useLocalSearchParams() as { id: string };
  const { currencyCode } = useLocale();
  const { walletId } = useAppSelector((state) => state.auth);
  const { decimalSeparator, groupSeparator, disableDecimal, showCurrency } =
    useSettings().styleMoneyLabel;
  const dispatch = useAppDispatch();
  const { t } = useLocale();
  const router = useRouter();
  const { data, isLoading, isFetching } = useGetTransactionByIdQuery({
    walletId,
    transactionId: id.toString() ?? skipToken,
  });
  const userId = useAppSelector((state) => state.auth.user._id);
  const wallet = useGetWalletByIdQuery({ walletId });
  const admins = wallet?.currentData?.admins;
  const owner = wallet?.currentData?.owner;
  const walletType = wallet?.currentData?.type;
  const [deleteTransaction, deleteResult] = useDeleteTransactionMutation();
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [messages, setMessage] = useState("");
  const deleteTransactionHandler = async () => {
    try {
      await deleteTransaction({ walletId, id });
      router.back();
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
    }
  };

  const handleDelete = async () => {
    if (
      walletType === "shared" &&
      (owner !== userId || admins.includes(userId))
    ) {
      setAlertVisible(true);
      setMessage(t("alerts.delete"));
      return;
    }
    Alert.alert(t("actions.delete"), t("actions.deletemessage"), [
      {
        text: t("actions.cancel"),
        style: "cancel",
      },
      {
        text: t("actions.delete"),
        style: "destructive",
        onPress: deleteTransactionHandler,
      },
    ]);
  };

  const onEdit = (id: string) => {
    router.push(`/(authenticated)/(tabs)/transaction`);
    dispatch(setEdit(id));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t("transaction.transactiondetails"),
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
              headerRight={() => (
                <HeaderButton
                  type="btn"
                  onPress={() => {
                    if (
                      walletType === "shared" &&
                      (owner !== userId || admins.includes(userId))
                    ) {
                      setAlertVisible(true);
                      setMessage(t("alerts.edit"));
                      return;
                    }
                    router.push(
                      `(authenticated)/(tabs)/home/edit-transaction?id=${id}` as Href
                    );
                  }}
                  button={() => (
                    <Image
                      source={require("@/src/assets/icons/edit.png")}
                      style={{ width: 24, height: 24, resizeMode: "contain" }}
                    />
                  )}
                />
              )}
            />
          ),
        }}
      />
      {isFetching ? (
        <Loading isLoading={isFetching} text="Loading..." />
      ) : (
        <View style={styles.details}>
          <View style={styles.amount}>
            <View style={styles.label}>
              <ThemedText
                type={TextType.FootnoteRegular}
                color={TextColor.Secondary}
              >
                {t("transaction.amount")}
              </ThemedText>
            </View>
            <View style={[styles.value]}>
              <ThemedText
                type={TextType.HeadlineSemibold}
                color={
                  data?.type === "income"
                    ? BrandColor.PrimaryColor[400]
                    : BrandColor.Red[300]
                }
              >
                {formatValue({
                  value: String(data?.amount),
                  decimalSeparator: decimalSeparator,
                  groupSeparator: groupSeparator,
                  suffix: showCurrency ? getCurrencySymbol(currencyCode) : "",
                  decimalScale: disableDecimal ? 0 : 2,
                })}
              </ThemedText>
            </View>
          </View>
          <View style={styles.info}>
            <View style={styles.item}>
              <View style={styles.label}>
                <ThemedText
                  type={TextType.FootnoteRegular}
                  color={TextColor.Secondary}
                >
                  {t("transaction.title")}
                </ThemedText>
              </View>
              <View style={styles.value}>
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={TextColor.Primary}
                  adjustsFontSizeToFit={false}
                >
                  {data?.title}
                </ThemedText>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.label}>
                <View style={styles.label}>
                  <ThemedText
                    type={TextType.FootnoteRegular}
                    color={TextColor.Secondary}
                  >
                    {t("transaction.categories")}
                  </ThemedText>
                </View>
              </View>
              <View
                style={[
                  styles.value,
                  {
                    flexDirection: "row",
                    gap: 4,
                    justifyContent: "flex-end",
                    alignItems: "center",
                  },
                ]}
              >
                <View style={styles.icon}>
                  {data?.category && (
                    <Image
                      source={getImg(data.category.icon)}
                      style={styles.iconImg}
                    />
                  )}
                </View>
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={TextColor.Primary}
                  adjustsFontSizeToFit={false}
                >
                  {categoriesDefault.includes(data?.category?.name!)
                    ? t(`categories.${data?.category?.name}`)
                    : data?.category?.name}
                </ThemedText>
              </View>
            </View>

            <View style={[styles.item]}>
              <View style={styles.label}>
                <ThemedText
                  type={TextType.FootnoteRegular}
                  color={TextColor.Secondary}
                >
                  {t("transaction.typetransaction")}
                </ThemedText>
              </View>
              <View style={styles.value}>
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={TextColor.Primary}
                  adjustsFontSizeToFit={false}
                >
                  {data?.type === "income"
                    ? t("home.income")
                    : t("home.expense")}
                </ThemedText>
              </View>
            </View>
            <View style={[styles.item, { borderBottomWidth: 0 }]}>
              <View style={styles.label}>
                <ThemedText
                  type={TextType.FootnoteRegular}
                  color={TextColor.Secondary}
                >
                  {t("transaction.createdAt")}
                </ThemedText>
              </View>
              <View style={styles.value}>
                <ThemedText
                  type={TextType.FootnoteSemibold}
                  color={TextColor.Primary}
                  adjustsFontSizeToFit={false}
                  style={{ textTransform: "capitalize" }}
                >
                  {format(
                    data?.createdAt ? new Date(data?.createdAt) : new Date(),
                    "dd/MM/yyyy', 'p"
                  )}
                </ThemedText>
              </View>
            </View>
          </View>
          {data?.img_url && (
            <View style={[styles.document, { marginTop: 12 }]}>
              <View style={styles.label}>
                <ThemedText
                  type={TextType.FootnoteRegular}
                  color={TextColor.Secondary}
                >
                  {t("transaction.document")}
                </ThemedText>
              </View>
              {data?.img_url ? (
                <Image source={{ uri: data.img_url }} style={styles.img} />
              ) : (
                <Image
                  source={require("@/src/assets/icons/no-image-icon.png")}
                  style={styles.img}
                />
              )}
            </View>
          )}
        </View>
      )}
      <View style={styles.bottom}>
        <Button
          text={t("goals.delete")}
          textColor={BackgroundColor.LightTheme.Primary}
          type="primary"
          state="normal"
          size="large"
          style={{ backgroundColor: BrandColor.Red[400] }}
          onPress={handleDelete}
          buttonLeft={() => (
            <Image
              source={require("@/src/assets/icons/recycle-bin.png")}
              style={{ width: 24, height: 24, resizeMode: "contain" }}
            />
          )}
        />
      </View>
      <CustomAlertModal
        isVisible={isAlertVisible}
        onClose={() => setAlertVisible(false)}
        title={t("alerts.notification")}
        message={messages}
      />
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    padding: 24,
    backgroundColor: BackgroundColor.LightTheme.Primary,
  },
  details: {
    gap: 8,
    marginTop: 14,
  },
  amount: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BackgroundColor.LightTheme.Primary,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 50,
  },
  label: {},
  value: {
    flex: 4,
    alignItems: "flex-end",
  },
  info: {
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: BackgroundColor.LightTheme.Primary,

    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BackgroundColor.LightTheme.Primary,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: BrandColor.Gray[200],
  },
  icon: {
    width: 24,
    height: 24,
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: BrandColor.Gray[200],
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconImg: {
    width: 12,
    height: 12,
    resizeMode: "contain",
  },
  document: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 140,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    overflow: "hidden",
  },
  img: {
    width: 100,
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
  },
});
