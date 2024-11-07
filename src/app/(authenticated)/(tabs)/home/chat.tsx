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
import { ActivityIndicator, Pressable, SectionList } from "react-native";
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
import * as ImagePicker from "expo-image-picker";

const DEFAULT_LIMIT = 20;
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const CLOUDINARY_UPLOAD_PRESET = "dy9yts4fa";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dy9yts4fa/image/upload";
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

interface UserProfileComponentProps {
  userId: string; // Define the type for userId
}

const UserProfileComponent = ({ userId }) => {
  const user = useGetInfoByIdQuery(userId);
  const avatar =
    user.currentData?.avatar_url ||
    "https://static-00.iconduck.com/assets.00/avatar-icgon-512x512-gu21ei4u.png";
  return (
    <View>
      {user && <Image style={styles.avatar} source={{ uri: avatar }} />}
    </View>
  );
};
const ChatBubble: FC<ChatBubbleProps> = ({ message }) => {
  const auth = useAppSelector((state) => state.auth);
  const userId = auth.user._id;
  const isCurrentUser = message.userId === userId;

  //   console.log(auth.user.avatar_url);
  //   console.log(<UserProfileComponent userId={isCurrentUser} />);
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
      }}
    >
      {!isCurrentUser && (
        <UserProfileComponent userId={message.userId} />
        // <Image style={styles.avatar} source={{ uri: message.avatar }} />
      )}

      <View
        style={[
          styles.bubbleContainer,
          isCurrentUser ? styles.bubbleSent : styles.bubbleReceived,
        ]}
      >
        <Text style={styles.userText}>{message.name}</Text>
        {message.images && message.images.length > 0 ? (
          <Image
            source={{ uri: message.images[0] }}
            style={styles.bubbleImage}
          />
        ) : (
          <Text style={styles.bubbleText}>{message.content}</Text>
        )}
      </View>

      {isCurrentUser && (
        <UserProfileComponent userId={message.userId} />
        // <Image style={styles.avatar} source={{ uri: message.avatar }} />
      )}
    </View>
  );
};

const Chat: FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const { t } = useLocale();
  const userId = auth.user._id;
  const { walletId } = useAppSelector((state) => state.auth);
  //   console.log(useGetInfoByIdQuery(userId).currentData?.avatar_url);
  const [sendMessage] = useCreateMessageMutation();
  const [messageContent, setMessageContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // Thêm state loading

  const {
    data: messages,
    error,
    isLoading,
    refetch,
  } = useGetAllMessagesByWalletIdQuery(walletId);

  const flatListRef = useRef<FlatList<any>>(null);
  // Use useEffect to scroll to the bottom when messages change

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000); // Fetch messages every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [refetch]);
  // Cuộn xuống khi component được mount
  // useEffect(() => {
  //     if (flatListRef.current) {
  //       flatListRef.current.scrollToEnd({ animated: true }); // Cuộn xuống cuối danh sách
  //     }
  //   }, []);
  useEffect(() => {
    if (messages && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true }); // Cuộn xuống cuối danh sách
    }
  }, [messages]);

  useEffect(() => {
    if (selectedImages.length > 0) {
      const sendMessageAsync = async () => {
        await handleSendMessage(); // Send the message when image is selected
      };
      sendMessageAsync();
    }
  }, [selectedImages]); // Dependency array listens to changes in selectedImages
  // Hàm gửi tin nhắn (với logic tự động gửi khi có hình ảnh)
  const handleSendMessage = async () => {
    if (selectedImages.length > 0 || messageContent.trim()) {
      try {
        await sendMessage({
          walletId,
          userId,
          content: messageContent,
          images: selectedImages, // Thêm mảng hình ảnh nếu có
        }).unwrap();

        // Reset sau khi gửi thành công
        setMessageContent("");
        setSelectedImages([]);
        refetch(); // Refetch để cập nhật danh sách tin nhắn
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      alert(t("alert.message"));
    }
  };
  // Hàm upload ảnh lên Cloudinary
  const uploadImageToCloudinary = async (uri: string) => {
    try {
      let formData = new FormData();
      const uriParts = uri.split(".");
      const fileType = uriParts[uriParts.length - 1]; // Lấy loại tệp từ URI

      formData.append("file", {
        uri,
        type: `image/${fileType}`,
        name: `upload.${fileType}`,
      });
      formData.append("upload_preset", "my_preset"); // Sử dụng preset mới "my_preset"

      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Cloudinary response data:", data); // In ra để kiểm tra

      if (data.secure_url) {
        return data.secure_url; // Trả về URL của ảnh đã upload
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false, // Select only one image
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setLoading(true); // Show loading indicator while uploading

      try {
        const uploadedUrl = await uploadImageToCloudinary(imageUri);
        setSelectedImages([uploadedUrl]);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false); // Hide loading indicator after image upload
      }
    }
  };

  console.log(selectedImages);
  if (isLoading === true) {
    return <Loading />; // Show a loading indicator while fetching
  }

  if (error) {
    return <Text>Fetching messages: {error.message}</Text>; // Handle error state
  }
  if (loading) {
    <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef} // Attach the ref to FlatList
        data={messages}
        renderItem={({ item }) => <ChatBubble message={item} />}
        keyExtractor={(item) => item._id?.toString() || ""}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={require("@/assets/images/gallery-icon.png")}
            style={styles.galleryIcon}
          />
        </TouchableOpacity>
        <TextInput
          placeholder={t("input.send")}
          style={styles.textInput}
          value={messageContent}
          onChangeText={setMessageContent}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Image
            source={require("@/assets/images/send-icon.png")}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  messageList: {
    flex: 1,
    // padding: 10,
    // paddingTop: 5,
    marginTop: 10,
  },
  bubbleContainer: {
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
    maxWidth: "75%",
  },
  bubbleSent: {
    backgroundColor: "#00bce7",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  bubbleReceived: {
    backgroundColor: "#e5e5ea",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  bubbleText: {
    color: "#000",
  },
  userText: {
    fontSize: 12,
    marginBottom: 5,
  },
  bubbleImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,

    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#e5e5ea",
  },
  galleryIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: "#e5e5ea",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  sendIcon: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
});

export default Chat;
