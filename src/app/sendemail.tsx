import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import forgotImage from "../assets/images/forgotPassword.png";
import { useRouter } from "expo-router";
import { EmailRegExp, PasswordRegExp } from "../utils/RegExp";

type Props = {};

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const sendemail = (props: Props) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const handleSendemail = () => {
    if (EmailRegExp.test(email)) {
      console.log("Email is valid");
      console.log(email);
      router.push({ pathname: "/verifyotp", params: { email } }); // Pass email as a query parameter
    } else {
      console.log("Invalid Email");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password recovery</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSendemail}>
        <Text style={styles.buttonText}>Recover password</Text>
      </TouchableOpacity>
      <Image style={styles.image} source={forgotImage} resizeMode="contain" />
    </View>
  );
};

export default sendemail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    // justifyContent: "center",
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
    height: 300, // Tùy chỉnh chiều cao của ảnh
  },
});
