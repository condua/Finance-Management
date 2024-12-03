import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import Icon from "react-native-vector-icons/FontAwesome";
import { WebView } from "react-native-webview";
import { BrandColor, Colors } from "@/src/constants/Colors";
import {
  useDemoteFromAdminMutation,
  useGetAllWalletsQuery,
  useGetWalletByIdQuery,
  useLeaveWalletMutation,
  usePromoteToAdminMutation,
  usePromoteToOwnerMutation,
  useRemoveMemberMutation,
} from "@/src/features/wallet/wallet.service";
import { useLocale } from "@/src/hooks/useLocale";
import { useRouter } from "expo-router";
import { setDefaultWallet } from "@/src/features/auth/authSlice";

type Props = {
  walletId?: string;
  memberId?: string;
  ownerId?: string;
  visible: boolean;
  user?: { avatar_url?: string; name?: string };
  admins?: [];
  onClose: () => void;
};
const Promote: React.FC<Props> = ({
  memberId,
  ownerId,
  visible,
  onClose,
  admins,
  user,
}) => {
  const auth = useAppSelector((state) => state.auth);
  const { t } = useLocale();
  const userId = auth.user._id;
  // console.log(userId);
  // console.log(ownerId);
  // console.log(memberId);
  const router = useRouter();
  const { walletId } = auth;
  const avatar =
    user?.avatar_url ||
    "https://static-00.iconduck.com/assets.00/avatar-icgon-512x512-gu21ei4u.png";
  const name = user?.name;
  const email = user?.email;
  const [promoteToOwner] = usePromoteToOwnerMutation();
  const [promoteToAdmin, { isLoading, isError, isSuccess }] =
    usePromoteToAdminMutation();
  const [demoteMember] = useDemoteFromAdminMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [leaveWallet] = useLeaveWalletMutation();
  const walletById = useGetWalletByIdQuery({ walletId });
  const walletMembers = walletById?.currentData?.members || [];
  const dispatch = useAppDispatch();
  const { data: allWallets } = useGetAllWalletsQuery();
  const privateWallets =
    allWallets?.filter((wallet) => wallet.type === "private") || [];

  console.log(walletMembers.length);

  const handlePromoteToLeader = async () => {
    try {
      await promoteToOwner({ walletId, memberId, ownerId }).unwrap();
      alert("Member promoted to leader successfully!");
    } catch (error) {
      console.error("Failed to promote member:", error);
    }
  };

  const handlePromoteMember = async () => {
    try {
      await promoteToAdmin({ walletId, memberId, ownerId }).unwrap();
      alert("Member promoted to admin successfully!");
    } catch (error) {
      console.error("Failed to promote member:", error);
    }
  };

  const handleDemoteMember = async () => {
    try {
      await demoteMember({ walletId, memberId, ownerId }).unwrap();
      alert("Member was demoted from admins successfully!");
    } catch (error) {
      console.error("Failed to demote member:", error);
    }
  };
  const handleDeleteMember = async () => {
    try {
      await removeMember({ walletId, memberId, ownerId }).unwrap();
      alert("Member was deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  // Chọn ví mặc định và quay lại màn hình chính
  const handleSelectWallet = (_id: string) => {
    if (walletId === _id) return;
    dispatch(setDefaultWallet(_id));
    router.push("/(authenticated)/(tabs)/home");
  };

  const handleLeaveGroup = async () => {
    if (walletMembers.length <= 1) {
      await leaveWallet({ walletId }).unwrap();
      if (privateWallets.length > 0) {
        handleSelectWallet(privateWallets[0]._id);
      }

      router.push("/(authenticated)/(tabs)/wallet");
      return;
    }
    if (ownerId === memberId) {
      alert("Bạn phải chuyển quyền trưởng nhóm trước khi rời khỏi nhóm");
      return;
    }
    try {
      await leaveWallet({ walletId }).unwrap();
      if (privateWallets.length > 0) {
        dispatch(setDefaultWallet(privateWallets[0]._id));
      }

      router.push("/(authenticated)/(tabs)/wallet");
    } catch (error) {
      console.error("Failed to leave group:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Image style={styles.avatar} source={{ uri: avatar }} />
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
            {ownerId === memberId ? (
              <></>
            ) : ownerId === userId ? (
              <TouchableOpacity
                style={styles.buttonPromote}
                onPress={handlePromoteToLeader}
              >
                <View style={styles.icon}>
                  <Icon name="arrow-up" size={18} color="#000" />
                </View>
                <Text style={{ fontSize: 16 }}>
                  {t("members.promoteowner")}
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
            {ownerId === memberId ? (
              <></>
            ) : ownerId === userId ? (
              admins.includes(memberId) ? (
                <TouchableOpacity
                  style={styles.buttonPromote}
                  onPress={handleDemoteMember}
                >
                  <View style={styles.icon}>
                    <Icon name="star" size={20} color="#000" />
                  </View>
                  <Text style={{ fontSize: 16 }}>{t("members.demote")}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.buttonPromote}
                  onPress={handlePromoteMember}
                >
                  <View style={styles.icon}>
                    <Icon name="star" size={20} color="#000" />
                  </View>
                  <Text style={{ fontSize: 16 }}>{t("members.promote")}</Text>
                </TouchableOpacity>
              )
            ) : (
              <></>
            )}

            {userId === memberId ? ( // Người dùng không thể tự xóa bản thân
              <></>
            ) : ownerId === userId ? ( // Owner có thể xóa bất kỳ ai, kể cả admin
              <TouchableOpacity
                style={styles.buttonDelete}
                onPress={handleDeleteMember}
              >
                <View style={styles.icon}>
                  <Icon name="minus" size={20} color="red" />
                </View>
                <Text style={{ fontSize: 16, color: "red" }}>
                  {t("members.remove")}
                </Text>
              </TouchableOpacity>
            ) : ownerId !== memberId &&
              admins?.includes(userId) &&
              !admins?.includes(memberId) ? ( // Admin chỉ có thể xóa member thường
              <TouchableOpacity
                style={styles.buttonDelete}
                onPress={handleDeleteMember}
              >
                <View style={styles.icon}>
                  <Icon name="minus" size={20} color="red" />
                </View>
                <Text style={{ fontSize: 16, color: "red" }}>
                  {t("members.remove")}
                </Text>
              </TouchableOpacity>
            ) : (
              <></> // Member không thể xóa bất kỳ ai
            )}
            {userId === memberId ? (
              <TouchableOpacity
                style={styles.buttonDelete}
                onPress={handleLeaveGroup}
              >
                <View style={styles.icon}>
                  <Icon name="minus" size={20} color="red" />
                </View>
                <Text style={{ fontSize: 16, color: "red" }}>
                  {t("members.leave")}
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
        {/* <WebView source={{ uri: "https://blog.logrocket.com/" }} />; */}
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Promote;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    fontSize: 14,
    color: BrandColor.Gray[800],
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonPromote: {
    width: "90%",
    // backgroundColor: "pink",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // marginBottom: 10,
    padding: 10,
  },
  buttonDelete: {
    width: "90%",
    // backgroundColor: "pink",
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    marginRight: 10,
    justifyContent: "center",
    borderRadius: 50,
  },
  webview: {
    width: "100%",
    height: 750,
  },
});
