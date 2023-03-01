import { FC, useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import UserModel, { User } from "../models/user_model";
import apiClient from "../api/ClientApi";

const Login: FC<{ route: any; navigation: any; setToken: any }> = ({
  route,
  navigation,
  setToken,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLoginCallback = async () => {
    console.log("login was pressed");
    try {
      const res: any = await UserModel.loginUser(email, password);
      if (!res) return 
      
      setToken(res.tokens.accessToken);
      await apiClient.setHeader("Authorization", "JWT " + res.tokens.accessToken)
      await AsyncStorage.setItem("temp", "temp");
      await AsyncStorage.setItem("refreshToken", res.tokens.refreshToken);
      await AsyncStorage.setItem("userId", res.userId);
      await AsyncStorage.setItem("accessToken", res.tokens.accessToken);

      const token1: any = await AsyncStorage.getItem("accessToken");
      const rtoken: any = await AsyncStorage.getItem("refreshToken");

    } catch (err) {
      console.log("fail to login the user: " + err);
    }
    // navigation.goBack();
  };

  const onRegisterCallback = () => {
    navigation.navigate("Register");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Login To the App</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder={"ENTER EMAIL"}
        />

        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder={"ENTER PASSWORD"}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={onLoginCallback} style={styles.button}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRegisterCallback} style={styles.button}>
            <Text style={styles.buttonText}>SIGNUP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "#DDDDDD",
  },
  avatar: {
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    margin: 40,
    width: "100%",
  },
  input: {
    height: 40,
    margin: 12, // for space between the imput texts
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
  },
  buttonsContainer: {
    //flex: 1,
    flexDirection: "row",
  },
  button: {
    flex: 1,
    margin: 12,
    padding: 12,
    backgroundColor: "#F05454",
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#222831",
  },
  cameraButton: {
    position: "absolute",
    bottom: -10,
    left: 10,
    width: 50,
    height: 50,
  },
  galleryButton: {
    position: "absolute",
    bottom: -10,
    right: 10,
    width: 50,
    height: 50,
  },
});

export default Login;