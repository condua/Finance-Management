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
import forgotImage from "../assets/images/forgot-password.png";
import { useRouter } from "expo-router";
import { EmailRegExp, PasswordRegExp } from "../utils/RegExp";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
import { useLocalSearchParams } from "expo-router";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "../features/auth/auth.service";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
type Props = {};

const verifyotp = (props: Props) => {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(300); // Timer in seconds (5:00)
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [reSendOtp] = useResendOtpMutation();
  const [error, setError] = useState<string | null>(null);

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

  const handleVerify = async () => {
    const otpValue = otp.join("");
    const otpValueNumber = parseInt(otp.join(""), 10);
    if (otpValue.length === 4) {
      try {
        const response = await verifyOtp({
          email,
          otp: otpValueNumber,
        }).unwrap();
        // Alert.alert("Success", "OTP Verified Successfully");
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "OTP Verified Successfully",
          button: "Close",
          onPressButton: () => {
            router.push({
              pathname: "/changepassword",
              params: { email, otp: otpValueNumber },
            });
          },
        });
      } catch (error) {
        // Alert.alert("Error", error?.message || "Failed to verify OTP.");
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: error?.message || "Failed to verify OTP.",
          button: "Close",
        });
      }
    } else {
      // Alert.alert("Error", "Please enter the complete OTP.");
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Please enter the complete OTP.",
        button: "Close",
      });
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", ""]);
    try {
      await reSendOtp({ email }).unwrap();
      // Alert.alert("Success", "OTP Resent Successfully");

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "OTP Resent Successfully",
        button: "Close",
      });
    } catch (err) {
      // Alert.alert("Error", err.message || "Failed to resend OTP.");
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: err?.message || "Failed to resend OTP.",
        button: "Close",
      });
    }
    setTimer(300); // Reset timer
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
    <AlertNotificationRoot>
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
    </AlertNotificationRoot>
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
