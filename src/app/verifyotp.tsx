import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import forgotImage from "../assets/images/forgotPassword.png";
import { useRouter } from "expo-router";
import { EmailRegExp, PasswordRegExp } from "../utils/RegExp";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
import { useLocalSearchParams } from "expo-router";

type Props = {};

const verifyotp = (props: Props) => {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(300); // Timer in seconds (5:00)

  const handleInputChange = (value, index) => {
    // Chỉ cho phép nhập số
    const numericValue = value.replace(/[^0-9]/g, ""); // Loại bỏ ký tự không phải số
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo nếu người dùng nhập đúng 1 ký tự
    if (numericValue.length === 1 && index < otp.length - 1) {
      const nextInput = `otpInput${index + 1}`;
      this[nextInput]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    const otpValueNumber = parseInt(otp.join(""), 10);
    console.log(otpValueNumber);
    if (otpValue.length === 4) {
      Alert.alert("OTP Verified", `Your OTP: ${otpValue}`);
      router.push({
        pathname: "/changepassword",
        params: {
          email: email,
          otp: otpValueNumber,
        },
      });
    } else {
      Alert.alert("Error", "Please enter the complete OTP.");
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", ""]);
    setTimer(192); // Reset timer
    Alert.alert("Resent", "A new code has been sent to your phone.");
  };

  // Định dạng thời gian
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // Đếm ngược thời gian
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check your phone</Text>
      <Text style={styles.subtitle}>We’ve sent the code to your phone</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleInputChange(value, index)}
            ref={(ref) => (this[`otpInput${index}`] = ref)}
          />
        ))}
      </View>
      <Text style={styles.timer}>Code expires in: {formatTimer(timer)}</Text>
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
        <Text style={styles.resendText}>Send again</Text>
      </TouchableOpacity>
    </View>
  );
};

export default verifyotp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  goBack: {
    position: "absolute",
    top: 50,
    left: 20,
    color: "#555",
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: -50,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
  },
  timer: {
    fontSize: 14,
    color: "#555",
    marginBottom: 30,
  },
  verifyButton: {
    width: 200,
    backgroundColor: "#fcb900",
    paddingVertical: 15,
    // paddingHorizontal: 80,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButton: {
    width: 200,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    alignItems: "center",
    // paddingHorizontal: 80,
  },
  resendText: {
    color: "#555",
    fontSize: 16,
  },
});
