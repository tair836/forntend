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
  ActivityIndicator,
  ToastAndroid,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import UserModel, { User } from "../models/UserModel";
import apiClient from "../api/ClientApi";

const Login: FC<{ route: any; navigation: any; setToken: any }> = ({
  route,
  navigation,
  setToken,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log("focusin login");
      setShowActivityIndicator(true);
      cleanScreen();
      setShowActivityIndicator(false);
    });
    return unsubscribe;
  }, []);

  const onLoginCallback = async () => {
    console.log("login was pressed");
    setShowActivityIndicator(true);
    if (email == "") {
      setShowActivityIndicator(false);
      setErrorMsg("please provide email");
      return;
    }
    if (password == "") {
      setShowActivityIndicator(false);
      setErrorMsg("please provide password");
      return;
    }

    try {
      const res: any = await UserModel.loginUser(email, password);
      console.log("after login request ");
      console.log(res);
      if (!res) {
        console.log("fail to login");
        setErrorMsg("failed to login - try again");
        setShowActivityIndicator(false);
        return;
      }
      if (res.status != 200) {
        console.log("returned status 400");
        setErrorMsg("failed to login - try again");
        setShowActivityIndicator(false);
        return;
      }
      const resData: any = res.data;
      setToken(resData.tokens.accessToken);
      await apiClient.setHeader(
        "Authorization",
        "JWT " + resData.tokens.accessToken
      );

      await AsyncStorage.setItem("temp", "temp");
      await AsyncStorage.setItem("refreshToken", resData.tokens.refreshToken);
      await AsyncStorage.setItem("userId", resData.userId);
      await AsyncStorage.setItem("accessToken", resData.tokens.accessToken);

      setShowActivityIndicator(false);
    } catch (err) {
      console.log("fail to login the user: " + err);
    }
    setShowActivityIndicator(false);
  };

  const onRegisterCallback = () => {
    console.log("register was pressed");
    navigation.navigate("Register");
  };

  const cleanScreen = () => {
    setEmail("");
    setPassword("");
    setErrorMsg("");
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator
        color={"#F05454"}
        size={50}
        animating={showActivityIndicator}
        style={{ position: "absolute", marginTop: 250, marginStart: 170 }}      />
      <Text style={styles.text}>Login To the App</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder={"Email Address"}
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder={"password"}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onLoginCallback} style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRegisterCallback} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      {errorMsg != "" && (
        <Text
          style={{
            fontSize: 20,
            color: "red",
            alignSelf: "center",
          }}
        >
          {errorMsg}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    //alignItems: "center",
    // backgroundColor: "grey",
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
    borderWidth: 2,
    padding: 10,
    borderRadius: 3,
    borderColor: "#006B6B",
    width: 260,
    alignSelf: "center",
    fontSize: 15,
  },
  buttonsContainer: {
    //flex: 1,
    flexDirection: "row",
  },
  button: {
    flex: 1,
    margin: 12,
    padding: 12,
    backgroundColor: "#009999",
    borderRadius: 10,
    width: 350,
    height: 50,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
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
  text: {
    fontWeight: "bold",
    fontSize: 40,
    alignSelf: "center",
    color: "#006B6B",
  },
});

export default Login;