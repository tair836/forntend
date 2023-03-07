import { FC, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';

import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import UserModel, { User } from "../models/UserModel";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DefaultPassword = "********";

const Setting: FC<{ route: any; navigation: any; setToken: any }> = ({
  route,
  navigation,
  setToken,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState(DefaultPassword);
  const [avatarUri, setAvatarUri] = useState("");
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const setUserDetails = async () => {
    const userId: any = await AsyncStorage.getItem("userId");
    if (userId != null) {
      const res: any = await UserModel.getUserById(userId);
      if (!res) {
        console.log("fail to get user");
        return;
      }
      const user: any = res.data;
      setName(user.name);
      setAvatarUri(user.imageUrl);
      setEmail(user.email);
    }
  };

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
    const unsubscribe = navigation.addListener("focus", async () => {
      setShowActivityIndicator(true);
      setErrorMsg("");
      setUserDetails();
      setShowActivityIndicator(false);
    });
    return unsubscribe;
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
        console.log("uri is: ");
        console.log(uri);
        setAvatarUri(uri);
      }
    } catch (err) {
      console.log("open camera error:" + err);
    }
  };

  const onSaveCallback = async () => {
    setShowActivityIndicator(true);
    if (email == "" || name == "" || password == "") {
      setErrorMsg("please provide name and password");
      setShowActivityIndicator(false);
      return;
    }

    let newDetails;
    if (password != DefaultPassword) {
      newDetails = {
        name: name,
        imageUrl: avatarUri,
        password: password,
        email: email,
      };
    } else {
      newDetails = {
        name: name,
        imageUrl: avatarUri,
        email: email,
      };
    }
    try {
      if (avatarUri != "") {
        console.log("uploading image");
        const url = await UserModel.uploadImage(avatarUri);
        newDetails.imageUrl = url;
        console.log("got url from upload: " + url);
      }
      console.log("updating the user's details");
      const userId: any = await AsyncStorage.getItem("userId");
      if (userId != null) {
        console.log(newDetails);
        await UserModel.updateUserById(userId, newDetails);
        console.log("updated");
        //setEditable(false);
        setPassword(DefaultPassword);
      } else {
        console.log("fail updation user");
      }
      await UserModel.updateUserById(userId, newDetails);
    } catch (err) {
      console.log("fail adding user: " + err);
    }
    setShowActivityIndicator(false);
    setErrorMsg("");
    //navigation.goBack();
  };

  const onLogoutCallback = async () => {
    console.log("logout was pressed");
    const userId: any = await AsyncStorage.getItem("userId");
    if (userId != null) {
      const res: any = await UserModel.logout();
      if (res) {
        setToken();
      }
    }
    // TODO - need to set access token - so the user will be logged out from the app
    // navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ActivityIndicator
          color={"#93D1C1"}
          size={130}
          animating={showActivityIndicator}
          style={{ position: "absolute", marginTop: 230, marginStart: 140 }}
        />
        <View>
          {avatarUri == "" && (
            <Image
              source={require("../assets/avatar.png")}
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
          placeholder={"Email Address"}
          editable={false}
        />
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder={"Name"}
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder={"password"}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={onSaveCallback} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onLogoutCallback} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    //marginTop: StatusBar.currentHeight,
    flex: 1,
    //backgroundColor: "grey",
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
    flex: 1,
    flexDirection: "row",
  },
  button: {
    margin: 12,
    padding: 12,
    marginLeft: 100,
    width: 200,
    backgroundColor: "#009999",
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
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
});

export default Setting;