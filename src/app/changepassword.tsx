import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
// import forgotImage from "../assets/images/forgot-password.png";
import { useLocalSearchParams, useRouter } from "expo-router";
// import close_eye from "../assets/images/close-eye.png";
// import open_eye from "../assets/images/open-eye.png";
import { useChangePasswordByOtpMutation } from "../features/auth/auth.service";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
type Props = {};

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const changepassword = (props: Props) => {
  const { email, otp } = useLocalSearchParams();
  const router = useRouter();
  const [newPassword, setNewPassword] = React.useState("");
  const [secureText, setSecureText] = useState(true);
  const close_eye = require("@/src/assets/images/closeeye.png");
  const open_eye = require("@/src/assets/images/openeye.png");
  const forgotImage = require("@/src/assets/images/forgot-password.png");
  const [eye, setEye] = useState(close_eye);
  const [isLoading, setIsLoading] = useState(false);

  const [changePasswordByOtp] = useChangePasswordByOtpMutation();

  const handleSecureText = () => {
    setSecureText(!secureText);
    setEye(secureText ? open_eye : close_eye);
  };

  // Hàm kiểm tra mật khẩu
  const validatePassword = (password: string) => {
    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegExp.test(password);
  };

  const handleChangePasswordByOtP = async () => {
    if (!validatePassword(newPassword)) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Invalid Password",
        textBody:
          "Password must include at least 6 characters, 1 uppercase letter, 1 lowercase letter, and 1 number.",
        button: "Close",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await changePasswordByOtp({
        email,
        otp: parseInt(otp),
        newPassword,
      }).unwrap();
      console.log(response.data);
      setIsLoading(false);

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "You have changed your password successfully",
        button: "Ok",
        onPressButton: () => router.push("/login"), // Điều hướng khi nhấn "close"
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to change password. Please try again.",
        button: "Close",
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <Text style={styles.title}>Password recovery</Text>
        <Text style={styles.subtitle}>
          Enter your new password to recover your password
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your new password"
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry={secureText}
          />
          <TouchableOpacity onPress={handleSecureText}>
            <Image style={{ width: 40, height: 40 }} source={eye} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePasswordByOtP}
          disabled={isLoading} // Vô hiệu hóa khi đang tải
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Recover password</Text>
          )}
        </TouchableOpacity>
        <Image style={styles.image} source={forgotImage} resizeMode="contain" />
      </View>
    </AlertNotificationRoot>
  );
};

export default changepassword;

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
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#000",
  },
  button: {
    width: screenWidth * 0.8,
    height: 50,
    backgroundColor: "#FFD700", // Yellow button
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
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
});
