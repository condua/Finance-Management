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
import { useAppSelector } from "@/src/hooks/hooks";
import Icon from "react-native-vector-icons/FontAwesome";
import { WebView } from "react-native-webview";
import { BrandColor, Colors } from "@/src/constants/Colors";

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
  const userId = auth.user._id;
  console.log(userId);
  console.log(ownerId);
  console.log(memberId);
  const { walletId } = auth;
  const avatar =
    user?.avatar_url ||
    "https://static-00.iconduck.com/assets.00/avatar-icgon-512x512-gu21ei4u.png";
  const name = user?.name;
  const email = user?.email;
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

            <TouchableOpacity style={styles.buttonPromote}>
              {ownerId === memberId ? (
                <></>
              ) : ownerId === userId || admins?.includes(userId) ? (
                admins.includes(memberId) ? (
                  <>
                    <View style={styles.icon}>
                      <Icon name="star" size={20} color="#000" />
                    </View>
                    <Text style={{ fontSize: 16 }}>
                      Gỡ vai trò quản trị viên
                    </Text>
                  </>
                ) : (
                  <>
                    <View style={styles.icon}>
                      <Icon name="star" size={20} color="#000" />
                    </View>
                    <Text style={{ fontSize: 16 }}>
                      Chỉ định làm quản trị viên
                    </Text>
                  </>
                )
              ) : (
                <></>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonDelete}>
              {userId === memberId ? (
                <></>
              ) : ownerId === userId ? (
                <>
                  <View style={styles.icon}>
                    <Icon name="minus" size={20} color="red" />
                  </View>
                  <Text style={{ fontSize: 16, color: "red" }}>
                    Xóa thành viên
                  </Text>
                </>
              ) : admins?.includes(userId) && !admins?.includes(memberId) ? (
                <>
                  <View style={styles.icon}>
                    <Icon name="minus" size={20} color="red" />
                  </View>
                  <Text style={{ fontSize: 16, color: "red" }}>
                    Xóa thành viên
                  </Text>
                </>
              ) : (
                <></>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonDelete}>
              {userId === memberId ? (
                <>
                  <View style={styles.icon}>
                    <Icon name="minus" size={20} color="red" />
                  </View>
                  <Text style={{ fontSize: 16, color: "red" }}>
                    Rời khỏi nhóm
                  </Text>
                </>
              ) : (
                <></>
              )}
            </TouchableOpacity>
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
