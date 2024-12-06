import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGetCategoryByIdQuery } from "@/src/features/category/category.service";
import { useAppSelector } from "@/src/hooks/hooks";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getImg } from "@/src/utils/getImgFromUri";
import moment from "moment-timezone"; // Import moment-timezone
import { BrandColor } from "@/src/constants/Colors";
import { useLocale } from "@/src/hooks/useLocale";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import { useGetWalletByIdQuery } from "@/src/features/wallet/wallet.service";

// Kiểu dữ liệu cho từng giao dịch
interface TransactionHistory {
  name: string;
  amount: string;
  title: string;
  category: string;
  type: string;
  createAt: string; // Thêm kiểu dữ liệu cho ngày giờ
}

// Props cho DetailsTransaction
interface DetailsTransactionProps {
  categoryId: string;
  history: Partial<TransactionHistory>;
  index: number;
}

// Hàm chuyển đổi ngày giờ sang giờ Việt Nam
const convertToVietnamTime = (dateString: string) => {
  return moment(dateString)
    .tz("Asia/Ho_Chi_Minh")
    .format("DD-MM-YYYY HH:mm:ss");
};

const DetailsTransaction: React.FC<DetailsTransactionProps> = ({
  categoryId,
  history,
  index,
}) => {
  const { data: category, isLoading } = useGetCategoryByIdQuery(categoryId);
  const { t, currencyCode } = useLocale();
  const { walletId } = useAppSelector((state) => state.auth);
  const { data: wallet, isLoading: walletLoading } = useGetWalletByIdQuery({
    walletId,
  });
  if (isLoading) {
    return <Text>{t("transaction.loading")}</Text>;
  }
  if (walletLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>
        {t("transaction.revision")}: {index + 1}
      </Text>
      {wallet?.type === "shared" && (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Người chỉnh sửa:</Text>
          <Text style={[styles.value, { fontWeight: "bold" }]}>
            {history.name || "N/A"}
          </Text>
        </View>
      )}
      <View style={styles.detailRow}>
        <Text style={styles.label}>{t("transaction.amount")}:</Text>
        <Text
          style={[
            styles.value,
            {
              color:
                history?.type === "expense"
                  ? BrandColor.Red[400]
                  : BrandColor.Blue[500],
              fontWeight: "bold",
            },
          ]}
        >
          {history.amount || "0"} {getCurrencySymbol(currencyCode)}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>{t("transaction.title")}:</Text>
        <Text style={styles.value}>{history.title || "N/A"}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>{t("transaction.categories")}:</Text>
        <View style={styles.categoryContainer}>
          <Image
            source={getImg(category?.icon || "")}
            style={styles.categoryIcon}
          />
          <Text style={styles.value}>{t(`categories.${category?.name}`)}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>{t("transaction.typetransaction")}:</Text>
        <Text style={styles.value}>{t(`transaction.${history.type}`)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>{t("transaction.createdAt")}:</Text>
        <Text style={styles.value}>
          {history?.createAt
            ? convertToVietnamTime(history.createAt)
            : "Chưa xác định"}
        </Text>
      </View>
    </View>
  );
};

const Page: React.FC = () => {
  const { histories } = useLocalSearchParams();

  let historiesArray: TransactionHistory[] = [];
  try {
    historiesArray = histories ? JSON.parse(histories as string) : [];
  } catch (error) {
    console.error("Không thể parse dữ liệu lịch sử:", error);
  }

  return (
    <ScrollView style={styles.pageContainer}>
      {historiesArray.map((history, index) => (
        <DetailsTransaction
          key={index}
          categoryId={history.category}
          history={history}
          index={index}
        />
      ))}
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 8,
  },
});
