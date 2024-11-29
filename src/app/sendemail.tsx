import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import forgotImage from "../assets/images/forgotPassword.png";
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Recovery</Text>
      <Text style={styles.subtitle}>
        Enter your email to recover your password
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="email@merchport.hk"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
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
      <Image style={styles.image} source={forgotImage} resizeMode="contain" />
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
});
