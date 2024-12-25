import TabButtons, {
  TabButtonType,
} from "@/src/components/navigation/TabButtons";
import { ThemedText } from "@/src/components/ThemedText";
import TransactionItem from "@/src/components/TransactionItem";
import {
  BackgroundColor,
  BrandColor,
  NeutralColor,
  TextColor,
} from "@/src/constants/Colors";
import { useLocale } from "@/src/hooks/useLocale";
import { TextType } from "@/src/types/text";
import { Href, Link, Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StyleSheet, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAppDispatch, useAppSelector } from "@/src/hooks/hooks";

import { useGetAllTransactionsQuery } from "@/src/features/transaction/transaction.service";

import Loading from "@/src/components/Loading";
import { formatValue } from "react-native-currency-input-fields";
import { formatBarChart } from "@/src/utils/analytics";
import { Category, Transaction } from "@/src/types/enum";
import Bar from "@/src/components/charts/Bar";
import { useSettings } from "@/src/hooks/useSetting";
import { abbrValueFormat } from "@/src/utils/abbrValueFormat";
import { getCurrencySymbol } from "@/src/utils/getCurrencySymbol";
import dayjs, { Dayjs } from "dayjs";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-ui-datepicker";
import { useGetAllCategoriesQuery } from "@/src/features/category/category.service";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { getImg } from "@/src/utils/getImgFromUri";
import Header from "@/src/components/navigation/Header";
import HeaderButton from "@/src/components/navigation/HeaderButton";
import { Pressable } from "react-native";
import { X } from "react-native-feather";

export enum CustomTab {
  Tab1,
  Tab2,
}

interface CategorySectionItem {
  [key: string]: Category[];
}
const screenWidth = Dimensions.get("window").width;

const Page = () => {
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<CustomTab>(CustomTab.Tab1);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [period, setPeriod] = useState("week");
  const [isFocusPeriod, setIsFocusPeriod] = useState(false);
  const {
    decimalSeparator,
    groupSeparator,
    disableDecimal,
    showCurrency,
    shortenAmount,
  } = useSettings().styleMoneyLabel;
  const [categories, setCategories] = useState<string[]>([]);
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

  const bottomSheetCategoryModalRef = useRef<BottomSheetModal>(null);
  const snapPointsCategory = useMemo(() => ["85%"], []);
  const { data: categoriesRes } = useGetAllCategoriesQuery();

  const { t } = useLocale();
  const { currencyCode } = useLocale();
  const buttons: TabButtonType[] = [
    { title: t("analytics.expense") },
    { title: t("analytics.income") },
  ];
  const dispatch = useAppDispatch();
  const { walletId } = useAppSelector((state) => state.auth);
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

  const { isLoading, data, isError, isFetching } = useGetAllTransactionsQuery(
    {
      walletId: walletId!,
      query: {
        period,
        sort: "desc",
        type: selectedTab === CustomTab.Tab1 ? "expense" : "income",
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

  const balanceTotal = useMemo(() => {
    return data?.reduce((acc, item) => acc + item.amount, 0);
  }, [data]);
  const dataChart = useMemo(
    () =>
      formatBarChart(
        data as Transaction[],
        period,
        customPeriod?.startDate.toString(),
        customPeriod?.endDate.toString()
      ),
    [data]
  );

  const categoriesFilteredByType = useMemo(
    () =>
      categoriesRes?.filter((category) => {
        if (selectedTab === CustomTab.Tab1) {
          return category.type === "expense";
        } else {
          return category.type === "income";
        }
      }),
    [categoriesRes, selectedTab]
  );

  const categoriesSections = useMemo(() => {
    if (categoriesFilteredByType && categoriesFilteredByType.length > 0) {
      const grouped = categoriesFilteredByType.reduce(
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
  }, [categoriesFilteredByType]);
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t("analytics.header"),
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
      <Loading isLoading={isFetching} text="" />
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
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ marginTop: 14 }}>
          <TabButtons
            buttons={buttons}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </View>
        <View style={styles.info}>
          <View>
            <ThemedText type={TextType.Title22Bold} color={TextColor.Primary}>
              {shortenAmount
                ? abbrValueFormat(
                    Number(balanceTotal),
                    showCurrency,
                    currencyCode
                  )
                : formatValue({
                    value: String(balanceTotal),
                    decimalSeparator: decimalSeparator,
                    groupSeparator: groupSeparator,
                    suffix: showCurrency ? getCurrencySymbol(currencyCode) : "",
                    decimalScale: disableDecimal ? 0 : 2,
                  })}
            </ThemedText>
          </View>
          <Dropdown
            style={[styles.dropdown, isFocusPeriod && { borderColor: "blue" }]}
            selectedTextStyle={styles.selectedTextStyle}
            data={periodOptions}
            maxHeight={100}
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
            onFocus={() => setIsFocusPeriod(true)}
            onBlur={() => setIsFocusPeriod(false)}
            onChange={(item) => {
              if (item.value === "custom") {
                setShowCalendar(true);
              }
              setPeriod(item.value);
              setIsFocusPeriod(false);
            }}
          />
        </View>
        <View style={[styles.chartSection]}>
          <Bar data={dataChart} />
        </View>
        {/* <View style={styles.btn100}>
          <InfoButton
            title={t('analytics.seereportbycategories')}
            icon={() => (
              <Image
                source={require('@/src/assets/icons/circle-chart.png')}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
            )}
            buttonRight={() => (
              <Image
                source={require('@/src/assets/icons/arrow-right.png')}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
            )}
            description={t('analytics.seereportbycategoriesdescription')}
            onPress={() =>
              router.navigate('/(authenticated)/(tabs)/analytics/categories-analytics')
            }
          />
        </View> */}
        <View style={styles.historySection}>
          <View style={styles.headerSection}>
            <ThemedText
              type={TextType.CalloutSemibold}
              color={TextColor.Primary}
            >
              {t("home.history")}
            </ThemedText>
            <Link href="/(authenticated)/(tabs)/home/history" asChild>
              <Text style={styles.link}>{t("home.seeall")}</Text>
            </Link>
          </View>
          <View>
            {data?.length === 0 && (
              <ThemedText
                type={TextType.FootnoteRegular}
                color={TextColor.Secondary}
                style={{ textAlign: "center", marginTop: 30 }}
              >
                {t(`home.notransactions`)}
              </ThemedText>
            )}
            {data?.slice(0, 8).map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  router.navigate({
                    pathname: "/(authenticated)/(tabs)/home/[id]",
                    params: { id: item._id },
                  })
                }
              >
                <TransactionItem
                  title={item.title}
                  category={item.category.name}
                  amount={item.amount}
                  icon={item.category.icon}
                  type={item.type}
                  date={item?.createdAt}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {data?.length! > 5 && (
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() =>
              router.navigate({
                pathname: "/(authenticated)/(tabs)/home/history",
                params: {
                  period,
                },
              })
            }
          >
            <Image
              source={require("@/src/assets/icons/arrow-down-blue.png")}
              style={{ width: 24, height: 24, resizeMode: "contain" }}
            />
            <ThemedText
              type={TextType.FootnoteRegular}
              color={BrandColor.Blue[600]}
            >
              {t("actions.more")}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>

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
                          {t(`transaction.${title}`)}
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
                              {t(`categories.${cat.name}`)}
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
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: BackgroundColor.LightTheme.Primary,
  },
  chartSection: {
    width: "100%",
    minHeight: 270,
    marginVertical: 20,
  },
  historySection: {
    marginTop: 18,
    gap: 6,
    flex: 1,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: {
    color: "#2A85FF",
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.4,
    textTransform: "capitalize",
  },
  info: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  btn100: {
    width: "100%",
    marginTop: 20,
  },
  linkBtn: {
    paddingBottom: 90,
    paddingTop: 20,
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    justifyContent: "center",
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
  modal: {
    maxHeight: 400,
    backgroundColor: "#F5FCFF",
    borderRadius: 12,
    padding: 12,
    margin: "auto",
    marginHorizontal: 24,
  },
});
