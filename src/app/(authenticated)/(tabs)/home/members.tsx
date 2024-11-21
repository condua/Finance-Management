import Loading from "@/src/components/Loading";
import { ThemedText } from "@/src/components/ThemedText";
import TransactionItem from "@/src/components/TransactionItem";
import { useGetAllMessagesByWalletIdQuery } from "./../../../../features/message/message.service";
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
import {
  FlatList,
  TextInput,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from "react-native";

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
import { messageApi } from "./../../../../features/message/message.service";
import { useGetInfoByIdQuery } from "@/src/features/user/user.service";
import { useCreateMessageMutation } from "./../../../../features/message/message.service";
import { useGetWalletByIdQuery } from "@/src/features/wallet/wallet.service";
import { useIsFocused, useNavigation } from "@react-navigation/native"; // Import hook này nếu bạn dùng React Navigation
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import Promote from "./promote";

const DEFAULT_LIMIT = 20;
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

type MessageType = {
  _id?: string;
  email?: string;
  userId?: string;
  content?: string;
  avatar?: string;
  images?: [];
  name?: string;
  walletId?: string;
  timestamp?: string;
};
const UserProfileComponent = ({ userId, owner, admins }) => {
  const user = useGetInfoByIdQuery(userId);
  // console.log(admins);
  const meId = useAppSelector((state) => state.auth.user._id);
  const { t } = useLocale();
  const avatar =
    user.currentData?.avatar_url ||
    "https://static-00.iconduck.com/assets.00/avatar-icgon-512x512-gu21ei4u.png";
  // console.log(user);
  const router = useRouter();
  const navigate = useNavigation;
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const myself = () => {
    if (userId === meId) {
      return ` (${t("members.you")})`;
    }
    return "";
  };
  return (
    <TouchableOpacity style={styles.userContainer} onPress={openModal}>
      {user && <Image style={styles.avatar} source={{ uri: avatar }} />}
      <View>
        <ThemedText color={TextColor.Primary}>
          {user.currentData?.name || "Unknown User"} {myself()}
        </ThemedText>

        {owner === userId && (
          <ThemedText color={TextColor.Secondary}>
            {t("members.owner")}
          </ThemedText>
        )}
        {admins.includes(userId) && (
          <ThemedText color={TextColor.Secondary}>
            {t("members.adminrole")}
          </ThemedText>
        )}
      </View>
      <Promote
        visible={modalVisible}
        onClose={closeModal}
        memberId={userId}
        user={user?.currentData}
        ownerId={owner}
        admins={admins}
      />
    </TouchableOpacity>
  );
};
const members = () => {
  const auth = useAppSelector((state) => state.auth);
  const { t } = useLocale();
  const { walletId } = auth;
  const isFocused = useIsFocused();
  const [toggle, setToggle] = useState("all");
  const handleToggle = () => {
    setToggle(toggle === "all" ? "admin" : "all");
  };

  const {
    data,
    isFetching: isFetchingWallet,
    refetch,
  } = useGetWalletByIdQuery(
    {
      walletId: walletId,
    },
    {
      refetchOnFocus: true, // Cập nhật lại dữ liệu khi màn hình được focus
    }
  );

  useEffect(() => {
    if (isFocused) {
      refetch(); // Gọi lại API khi màn hình được focus
    }
  }, [isFocused, refetch]);

  const members = data?.members || [];
  const owner = data?.owner || null;
  const admins = data?.admins || [];
  console.log(data);

  const renderItem = ({ item: memberId }) => (
    <UserProfileComponent userId={memberId} owner={owner} admins={admins} />
  );
  return (
    <View style={styles.container}>
      <View style={styles.options}>
        <TouchableOpacity
          style={[styles.allMembers, toggle === "all" && styles.activeButton]}
          onPress={handleToggle}
        >
          <Text
            style={{
              color: toggle === "all" ? "black" : "#bbbbbb",
              fontSize: 15,
            }}
          >
            {t("members.all")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.adminMembers,
            toggle === "admin" && styles.activeButton,
          ]}
          onPress={handleToggle}
        >
          <Text
            style={{
              color: toggle === "admin" ? "black" : "#bbbbbb",
              fontSize: 15,
            }}
          >
            {t("members.adminstrators")}
          </Text>
        </TouchableOpacity>
      </View>
      {isFetchingWallet && <Loading />}
      {toggle === "all" && (
        <Text style={{ marginLeft: 20, marginTop: 15, fontSize: 15 }}>
          {members.length}{" "}
          {members.length === 1 ? t("members.member") : t("members.members")}
        </Text>
      )}
      {toggle === "admin" && (
        <Text style={{ marginLeft: 20, marginTop: 15, fontSize: 15 }}>
          {admins.length + 1}{" "}
          {admins.length + 1 === 1 ? t("members.admin") : t("members.admins")}
        </Text>
      )}
      <FlatList
        data={toggle === "all" ? members : [owner, ...admins]}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
  options: {
    width: screenWidth * 0.9,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  allMembers: {
    display: "flex",
    width: screenWidth * 0.4,
    height: 35,
    // backgroundColor: "none",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  adminMembers: {
    display: "flex",
    justifyContent: "center",
    width: screenWidth * 0.4,
    height: 35,
    alignItems: "center",
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "lightgray",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default members;
