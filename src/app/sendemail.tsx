import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  Animated,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { EmailRegExp } from "../utils/RegExp";
import { useSendEmailMutation } from "../features/auth/auth.service";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const SendEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sendEmail, { isLoading }] = useSendEmailMutation();
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const placeholderAnim = useRef(new Animated.Value(0)).current; // Giá trị để điều khiển animation
  const [exampleEmail, setExampleEmail] = useState("Example@gmail.com");
  // Kích hoạt animation khi focus/blur
  const handleFocus = () => {
    setIsFocused(true);
    setExampleEmail("Your email");
    Animated.timing(placeholderAnim, {
      toValue: 1, // Di chuyển lên
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (email === "") {
      setIsFocused(false);
      setExampleEmail("Example@gmail.com");
      Animated.timing(placeholderAnim, {
        toValue: 0, // Trở lại vị trí ban đầu
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSendEmail = async () => {
    if (!EmailRegExp.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setError(null); // Reset error
      const response = await sendEmail({ email }).unwrap();
      console.log(response.message);
      setEmail("");
      router.push({ pathname: "/verifyotp", params: { email } }); // Pass email as a query parameter
    } catch (err: any) {
      console.error(err);
      setError(
        err.data?.error.email || "Failed to send email. Please try again."
      );
    }
  };

  // Tính toán vị trí của placeholder
  const placeholderTranslateY = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, -10], // Điều chỉnh vị trí placeholder (xuống/lên)
  });

  const placeholderFontSize = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 14], // Điều chỉnh kích thước font
  });

  const placeholderColor = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#aaa", "black"], // Điều chỉnh kích thước font
  });

  const placeholderPadding = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5], // Điều chỉnh kích thước font
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Recovery</Text>
      <Text style={styles.subtitle}>
        Enter your email to recover your password
      </Text>
      <View style={styles.inputContainer}>
        {/* Placeholder */}
        <Animated.Text
          style={[
            styles.placeholder,
            {
              transform: [{ translateY: placeholderTranslateY }],
              fontSize: placeholderFontSize,
              color: placeholderColor,
              paddingHorizontal: placeholderPadding,
            },
          ]}
        >
          {exampleEmail}
        </Animated.Text>
        {/* TextInput */}

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="email-address"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSendEmail}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Recover Password</Text>
        )}
      </TouchableOpacity>
      <Image
        style={styles.image}
        source={require("@/src/assets/images/forgot-password.png")}
        resizeMode="contain"
      />
    </View>
  );
};

export default SendEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    marginTop: 150,
  },
  subtitle: {
    fontSize: 17,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    width: screenWidth * 0.8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    position: "relative", // Important for placing the placeholder
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "gray",
  },
  button: {
    width: screenWidth * 0.8,
    height: 50,
    backgroundColor: "#FFD700",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#FFD700",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  image: {
    position: "absolute",
    bottom: -10,
    width: "100%",
    height: 300,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 15,
  },
  placeholder: {
    position: "absolute",
    left: 10,
    top: 0,
    color: "#aaa",
    backgroundColor: "white",
  },
});
