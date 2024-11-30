import Loading from "@/src/components/Loading";
import { ThemedText } from "@/src/components/ThemedText";
import TransactionItem from "@/src/components/TransactionItem";
import {
  BackgroundColor,
  BrandColor,
  NeutralColor,
  TextColor,
} from "@/src/constants/Colors";
import { useGetAllTransactionsQuery } from "@/src/features/transaction/transaction.service";
import { useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import { useLocale } from "@/src/hooks/useLocale";
import { Category, Transaction } from "@/src/types/enum";
import { TextType } from "@/src/types/text";
import { getImg } from "@/src/utils/getImgFromUri";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, SectionList } from "react-native";
import { Image, SafeAreaView, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  format,
  isYesterday,
  isToday,
  differenceInDays,
  endOfDay,
} from "date-fns";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Header from "@/src/components/navigation/Header";
import HeaderButton from "@/src/components/navigation/HeaderButton";
import { AntDesign, Foundation } from "@expo/vector-icons";
import ListHeader from "@/src/components/ListHeader";
import { Dropdown } from "react-native-element-dropdown";
import { formatValue } from "react-native-currency-input-fields";
import { skipToken } from "@reduxjs/toolkit/query";
import dayjs, { Dayjs } from "dayjs";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-ui-datepicker";
import SearchBar from "@/src/components/SearchBar";
import { Filter, X } from "react-native-feather";
import { useDebounce } from "@/src/hooks/useDebounce";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useGetAllCategoriesQuery } from "@/src/features/category/category.service";
import { CustomAlertModal } from "@/src/components/navigation/TabBar";
const DEFAULT_LIMIT = 20;
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

interface SectionItem {
  [key: string]: Transaction[];
}

interface CategorySectionItem {
  [key: string]: Category[];
}

const history = () => {
  const router = useRouter();
  const { t } = useLocale();
  const { period: periodParam, categoryId } = useLocalSearchParams() as {
    period: string;
    categoryId: string;
  };
  const periodOptions = [
    { label: t("period.day"), value: "day" },
    { label: t("period.week"), value: "week" },
    { label: t("period.month"), value: "month" },
    { label: t("period.year"), value: "year" },
    { label: t("period.all"), value: "all" },
    {
      label: t("period.custom"),
      value: "custom",
    },
  ];

  const { height } = Dimensions.get("window");
  const { bottom } = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { currencyCode } = useLocale();
  const { walletId } = useAppSelector((state) => state.auth);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [offset, setOffset] = useState("");
  const [period, setPeriod] = useState("month");
  const [showCalendar, setShowCalendar] = useState(false);
  const [customPeriod, setCustomPeriod] = useState<
    | {
        startDate: Dayjs;
        endDate: Dayjs;
      }
    | undefined
  >({
    startDate: dayjs(),
    endDate: dayjs(),
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [categories, setCategories] = useState<string[]>([]);

  const bottomSheetCategoryModalRef = useRef<BottomSheetModal>(null);
  const snapPointsCategory = useMemo(() => ["85%"], []);
  const { data: categoriesRes } = useGetAllCategoriesQuery();

  const handleSetCategories = (id: string) => {
    if (categories.includes(id)) {
      setCategories((prev) => prev.filter((cat) => cat !== id));
    } else {
      setCategories((prev) => [...prev, id]);
    }
  };

  const renderBackdropCategoryModal = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.3}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="collapse"
        onPress={() => bottomSheetCategoryModalRef.current?.dismiss()}
      />
    ),
    []
  );

  const showCategoryModal = async () => {
    bottomSheetCategoryModalRef.current?.present();
  };

  useEffect(() => {
    if (periodParam) {
      setPeriod(periodParam);
    }
  }, [periodParam]);

  const { isFetching, data, isError, isLoading, isSuccess, currentData } =
    useGetAllTransactionsQuery(
      {
        walletId,
        query: {
          period,
          sort: "desc",
          startDate:
            customPeriod?.startDate && customPeriod?.startDate.toString(),
          endDate: customPeriod?.endDate
            ? customPeriod?.endDate?.toString()
            : dayjs().toString(),
        },
        categories: [...new Set(categories)],
      },
      {
        skip: showCalendar,
      }
    );

  const handleOnChange = useCallback(
    (item: { value: string; label: string }) => {
      if (item.value === "custom") {
        setShowCalendar(true);
      }
      setPeriod(item.value);
    },
    []
  );

  const convertAmountToString = useMemo(() => {
    if (data)
      return data.map((item) => ({ ...item, amount: String(item.amount) }));
  }, [data]);

  const searchData = useMemo(() => {
    if (!Number(debouncedSearch))
      return (
        data &&
        data.filter(
          (tran) =>
            tran.category.name.includes(debouncedSearch) ||
            tran.title.includes(debouncedSearch)
        )
      );
    if (convertAmountToString) {
      const foundAmount = convertAmountToString.filter((tran) =>
        tran.amount.includes(debouncedSearch)
      );
      return foundAmount.map((tran) => ({
        ...tran,
        amount: Number(tran.amount),
      }));
    }
  }, [data, debouncedSearch]);

  const sections = useMemo(() => {
    if (searchData && searchData.length > 0) {
      if (period === "day") {
        return [
          {
            title: format(new Date(), "PP"),
            data: searchData,
          },
        ];
      } else if (period === "week") {
        const grouped = searchData.reduce(
          (acc: { [key: string]: Transaction[] }, item) => {
            const key = format(new Date(item.createdAt), "EEEE', 'dd/MM/yyyy");
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(item);
            return acc;
          },
          {} as SectionItem
        );
        return Object.entries(grouped).map(([key, value]) => ({
          title: key,
          data: value,
        }));
      } else if (period === "month") {
        const grouped = searchData.reduce((acc, item) => {
          const key = format(new Date(item.createdAt), "PP");
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {} as SectionItem);
        return Object.entries(grouped).map(([key, value]) => ({
          title: key,
          data: value,
        }));
      } else if (period === "year") {
        const grouped = searchData.reduce((acc, item) => {
          const key = format(new Date(item.createdAt), "MMMM");
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {} as SectionItem);
        return Object.entries(grouped).map(([key, value]) => ({
          title: key,
          data: value,
        }));
      } else if (period === "all") {
        const grouped = searchData.reduce((acc, item) => {
          const key = format(new Date(item.createdAt), "yyyy");
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {} as SectionItem);
        return Object.entries(grouped).map(([key, value]) => ({
          title: key,
          data: value,
        }));
      } else {
        const days = differenceInDays(
          customPeriod?.endDate
            ? new Date(customPeriod?.endDate)
            : endOfDay(new Date()),
          customPeriod?.startDate
            ? new Date(customPeriod?.startDate)
            : new Date()
        );
        if (days < 31) {
          return [
            {
              title: format(new Date(), "PP"),
              data: data,
            },
          ];
        } else if (days < 62) {
          const grouped = searchData.reduce(
            (acc: { [key: string]: Transaction[] }, item) => {
              const key = format(
                new Date(item.createdAt),
                "EEEE', 'dd/MM/yyyy"
              );
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(item);
              return acc;
            },
            {} as SectionItem
          );
          return Object.entries(grouped).map(([key, value]) => ({
            title: key,
            data: value,
          }));
        } else {
          const grouped = searchData.reduce((acc, item) => {
            const key = format(new Date(item.createdAt), "MMMM");
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(item);
            return acc;
          }, {} as SectionItem);
          return Object.entries(grouped).map(([key, value]) => ({
            title: key,
            data: value,
          }));
        }
      }
    }
    return [
      {
        title: "",
        data: [],
      },
    ];
  }, [searchData]);

  const categoriesSections = useMemo(() => {
    if (categoriesRes && categoriesRes.length > 0) {
      const grouped = categoriesRes.reduce(
        (acc: { [key: string]: Category[] }, item) => {
          const key = item.type;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        },
        {} as CategorySectionItem
      );
      return Object.entries(grouped).map(([key, value]) => ({
        title: key,
        data: value,
      }));
    }
    return [
      {
        title: "",
        data: [],
      },
    ];
  }, [categoriesRes]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: BackgroundColor.LightTheme.Primary,
      }}
    >
      <Stack.Screen
        options={{
          headerTitle: t("home.history"),
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
              headerRight={() => (
                <HeaderButton
                  onPress={() => showCategoryModal()}
                  type="btn"
                  button={() => (
                    <Image
                      source={require("@/src/assets/icons/filter.png")}
                      style={{ width: 22, height: 22, resizeMode: "contain" }}
                    />
                  )}
                />
              )}
            />
          ),
        }}
      />
      <SafeAreaView
        style={{
          paddingHorizontal: 24,
          backgroundColor: BackgroundColor.LightTheme.Primary,
          height: height * 0.84,
        }}
      >
        <Loading isLoading={isFetching} text="Loading..." />
        <Modal
          style={styles.modal}
          isVisible={showCalendar}
          onBackdropPress={() => setShowCalendar(false)}
        >
          <View style={{ alignItems: "flex-end", padding: 12 }}>
            <Pressable
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => setShowCalendar(false)}
            >
              <X width={24} height={24} color={TextColor.Primary} />
            </Pressable>
          </View>
          <DateTimePicker
            height={300}
            mode="range"
            timePicker={true}
            startDate={customPeriod?.startDate}
            endDate={customPeriod?.endDate}
            onChange={({ startDate, endDate }) => {
              setCustomPeriod({
                startDate,
                endDate,
              });
            }}
          />
        </Modal>
        <View style={styles.summary}>
          <SearchBar value={search} onChangeText={(text) => setSearch(text)} />
        </View>

        <SectionList
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item._id}
              onPress={() =>
                router.push({
                  pathname: "/(authenticated)/(tabs)/home/[id]",
                  params: { id: item._id },
                })
              }
            >
              <TransactionItem
                transactionId={item._id}
                amount={item.amount}
                type={item.type}
                date={item.createdAt}
                category={item.category.name}
                icon={item.category.icon}
                title={item.title}
                histories={item.histories}
              />
            </TouchableOpacity>
          )}
          sections={sections}
          renderSectionHeader={({ section: { title, data } }) => {
            const totalAmount = data.reduce((acc, item) => {
              return item.type === "income"
                ? acc + item.amount
                : acc - item.amount;
            }, 0);
            const flag = data.length && period !== "year" && period !== "all";
            return (
              <View style={styles.sectionHeader}>
                <View>
                  <ThemedText
                    type={TextType.FootnoteSemibold}
                    color={TextColor.Primary}
                  >
                    {title}
                  </ThemedText>
                  {flag
                    ? (isToday(new Date(data[0].createdAt)) ||
                        isYesterday(new Date(data[0].createdAt))) && (
                        <ThemedText
                          type={TextType.FootnoteSemibold}
                          color={TextColor.Secondary}
                        >
                          {isToday(new Date(data[0].createdAt))
                            ? t("period.today")
                            : t("period.yesterday")}
                        </ThemedText>
                      )
                    : undefined}
                </View>
                <ThemedText
                  type={TextType.CalloutSemibold}
                  color={
                    Number(totalAmount) < 0
                      ? BrandColor.Red[300]
                      : BrandColor.PrimaryColor[400]
                  }
                >
                  {data.length !== 0 &&
                    formatValue({
                      value: Math.abs(totalAmount).toString(),
                      intlConfig: {
                        locale: "de-DE",
                        currency: currencyCode,
                      },
                    })}
                </ThemedText>
              </View>
            );
          }}
          ListHeaderComponent={
            <ListHeader
              title={t("home.alltransactions")}
              rightComponent={
                <Dropdown
                  style={[styles.dropdown]}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={periodOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  renderRightIcon={() => (
                    <AntDesign
                      name="down"
                      size={12}
                      color={BrandColor.PrimaryColor[400]}
                      style={styles.icon}
                    />
                  )}
                  itemTextStyle={{ fontSize: 12 }}
                  value={period}
                  onChange={handleOnChange}
                />
              }
            />
          }
          stickySectionHeadersEnabled={true}
        />
        {data && data?.length === 0 && (
          <View style={styles.note}>
            <ThemedText
              type={TextType.FootnoteRegular}
              color={TextColor.Secondary}
            >
              {t("home.notransactions")}
            </ThemedText>
          </View>
        )}
        <View style={{ height: bottom }}></View>
        <BottomSheetModal
          ref={bottomSheetCategoryModalRef}
          index={0}
          backdropComponent={renderBackdropCategoryModal}
          snapPoints={snapPointsCategory}
          handleComponent={null}
          enableOverDrag={false}
          enablePanDownToClose
        >
          <BottomSheetScrollView style={styles.bottomSheetModal}>
            <View style={styles.header}>
              <View style={styles.horizontalBar}></View>
              <ThemedText
                type={TextType.CalloutSemibold}
                color={TextColor.Primary}
              >
                {t("transaction.categories")}
              </ThemedText>
            </View>

            <SafeAreaView>
              <ScrollView>
                {categoriesSections &&
                  categoriesSections.map((item, index) => {
                    const { title, data } = item;
                    return (
                      <View key={item.title}>
                        <View style={{ marginTop: 24, marginBottom: 12 }}>
                          <ThemedText
                            type={TextType.CalloutSemibold}
                            color={TextColor.Primary}
                            style={{ textTransform: "capitalize" }}
                          >
                            {title}
                          </ThemedText>
                        </View>
                        {data &&
                          data.map((cat) => (
                            <TouchableOpacity
                              key={cat._id}
                              style={styles.item}
                              onPress={() => handleSetCategories(cat._id)}
                            >
                              <View style={styles.iconCover}>
                                <Image
                                  source={getImg(cat.icon)}
                                  style={styles.iconitem}
                                />
                              </View>
                              <ThemedText
                                type={TextType.SubheadlineRegular}
                                color={TextColor.Primary}
                              >
                                {cat.name}
                              </ThemedText>
                              <View style={{ position: "absolute", right: 12 }}>
                                <TouchableOpacity
                                  onPress={() => handleSetCategories(cat._id)}
                                >
                                  {categories.includes(cat._id) ? (
                                    <Image
                                      source={require("@/src/assets/icons/checked.png")}
                                      style={{ width: 24, height: 24 }}
                                    />
                                  ) : (
                                    <Image
                                      source={require("@/src/assets/icons/circle_plus2.png")}
                                      style={{ width: 24, height: 24 }}
                                    />
                                  )}
                                </TouchableOpacity>
                              </View>
                            </TouchableOpacity>
                          ))}
                      </View>
                    );
                  })}
              </ScrollView>
            </SafeAreaView>
            <View style={{ height: 80 }} />
          </BottomSheetScrollView>
        </BottomSheetModal>
      </SafeAreaView>
    </View>
  );
};
export default history;
const styles = StyleSheet.create({
  dropdown: {
    width: 100,
    height: 44,
    borderColor: BrandColor.Gray[300],
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    fontSize: 12,
  },
  selectedTextStyle: {
    fontSize: 12,
    color: TextColor.Primary,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 4,
    backgroundColor: BackgroundColor.LightTheme.Primary,
    paddingVertical: 12,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    gap: 12,
  },
  note: {
    justifyContent: "center",
    alignItems: "center",
    bottom: screenHeight * 0.4,
  },
  modal: {
    maxHeight: 400,
    backgroundColor: "#F5FCFF",
    borderRadius: 12,
    padding: 12,
    margin: "auto",
    marginHorizontal: 24,
  },
  filter: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColor.Gray[200],
  },
  iconCover: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColor.Gray[200],
    backgroundColor: BackgroundColor.LightTheme.Primary,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCategory: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  bottomSheetModal: {
    width: screenWidth,
    paddingHorizontal: 24,
    borderStartStartRadius: 24,
    flex: 1,
  },
  header: {
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
    paddingBottom: 12,
    borderBottomColor: NeutralColor.GrayLight[100],
    borderBottomWidth: 1,
  },
  horizontalBar: {
    width: "20%",
    height: 6,
    backgroundColor: NeutralColor.GrayLight[50],
    borderRadius: 18,
  },
  item: {
    width: "100%",
    backgroundColor: BrandColor.Gray[50],
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomColor: BrandColor.Gray[100],
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconitem: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
});
