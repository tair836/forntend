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
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import FormData from "form-data";

import UserModel, { User } from "../models/user_model";

const Register: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUri, setAvatarUri] = useState("");

  const askPermission = async () => {
    try {
      const res = await ImagePicker.getCameraPermissionsAsync();
      if (!res.granted) {
        alert("camera permission is requiered!");
      }
    } catch (err) {
      console.log("ask permission error " + err);
    }
  };

  useEffect(() => {
    askPermission();
  }, []);

  const openCamera = async () => {
    try {
      const res = await ImagePicker.launchCameraAsync();
      if (!res.canceled && res.assets.length > 0) {
        const uri = res.assets[0].uri;
        setAvatarUri(uri);
      }
    } catch (err) {
      console.log("open camera error:" + err);
    }
  };

  const openGallery = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync();
      if (!res.canceled && res.assets.length > 0) {
        const uri = res.assets[0].uri;
        setAvatarUri(uri);
      }
    } catch (err) {
      console.log("open camera error:" + err);
    }
  };

  const onRegisterCallback = async () => {
    // need to add progress bar (called activity indicator)
    console.log("register was pressed");
    const user: User = {
      email: email,
      password: password,
      image: "",
    };
    try {
      if (avatarUri != "") {
        console.log("uploading image");
        const url = await UserModel.uploadImage(avatarUri);
        user.image = url;
        console.log("got url from upload: " + url);
      }
      console.log("saving user");
      await UserModel.addNewUser(user);
    } catch (err) {
      console.log("fail adding user: " + err);
    }
    navigation.goBack();
  };

  const onCancelCallback = () => {
    console.log("cancel was pressed");
    navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          {avatarUri == "" && (
            <Image
              source={require("../assets/ava.png")}
              style={styles.avatar}
            ></Image>
          )}
          {avatarUri != "" && (
            <Image source={{ uri: avatarUri }} style={styles.avatar}></Image>
          )}

          <TouchableOpacity onPress={openCamera}>
            <Ionicons name={"camera"} style={styles.cameraButton} size={50} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery}>
            <Ionicons name={"image"} style={styles.galleryButton} size={50} />
          </TouchableOpacity>
        </View>
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
          <TouchableOpacity onPress={onCancelCallback} style={styles.button}>
            <Text style={styles.buttonText}>CANCEL</Text>
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
    margin: 12, 
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

export default Register;