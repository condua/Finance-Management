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
import { useLocalSearchParams } from "expo-router";
import { type } from "./../types/enum";
import closeEye from "../assets/images/closeEye.png";
import openEye from "../assets/images/openEye.png";
type Props = {};

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const changepassword = (props: Props) => {
  const { email, otp } = useLocalSearchParams();
  console.log(email + " " + otp);
  const [newPassword, setNewPassword] = React.useState("");
  const [secureText, setSecureText] = useState(true);
  const [eye, setEye] = useState(closeEye);
  const handleSecureText = () => {
    setSecureText(!secureText);
    if (eye === closeEye) {
      setEye(openEye);
    } else {
      setEye(closeEye);
    }
  };
  return (
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Recover password</Text>
      </TouchableOpacity>
      <Image style={styles.image} source={forgotImage} resizeMode="contain" />
    </View>
  );
};

export default changepassword;

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
