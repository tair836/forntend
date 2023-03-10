import { FC, useState } from "react";

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  Alert,
  TextInput,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import PostModel, { NewPost } from "../models/PostModel";
const EditPost: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const [postDescription, setPostDescription] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  let postId = route.params.postId;

  const setDetails = async () => {
    console.log(postId);
    const post = await PostModel.getPostById(postId);
    if (post.status != "200") {
      navigation.goBack();
    } else {
      setPostDescription(post.data.post.message);
      setImageUri(post.data.post.imageUrl);
    }
  };

  const askPermission = async () => {
    try {
      const res = await ImagePicker.getCameraPermissionsAsync();
      if (!res.granted) {
        alert("Camera permission is require");
      }
    } catch (err) {
      console.log("ask permission error " + err);
    }
  };
  React.useEffect(() => {
    askPermission();

    const unsubscribe = navigation.addListener("focus", async () => {
      setShowActivityIndicator(true);
      console.log("focusin");
      setErrorMsg("");
      setDetails();
      setShowActivityIndicator(false);
    });
    return unsubscribe;
  }, []);

  const openCamera = async () => {
    try {
      const res = await ImagePicker.launchCameraAsync();
      if (!res.canceled && res.assets.length > 0) {
        const uri = res.assets[0].uri;
        setImageUri(uri);
      }
    } catch (err) {
      console.log("open camera error " + err);
    }
  };
  const openGallery = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync();
      if (!res.canceled && res.assets.length > 0) {
        const uri = res.assets[0].uri;
        setImageUri(uri);
      }
    } catch (err) {
      console.log("open camera error " + err);
    }
  };

  const onSaveCallback = async () => {
    console.log("edit????");
    setShowActivityIndicator(true);

    if (imageUri == "" || postDescription == "") {
      setErrorMsg("please provide text and image");
      setShowActivityIndicator(false);
      return;
    }

    const post: NewPost = {
      message: postDescription,
      imageUrl: "",
    };
    try {
      if (imageUri != "") {
        console.log("trying to upload image");
        const url = await PostModel.uploadImage(imageUri);
        post.imageUrl = url;
      }
      await PostModel.editPostById(postId, post);
      console.log("posted");
      setShowActivityIndicator(false);
    } catch (err) {
      console.log("fail updating post");
    }
    setShowActivityIndicator(false);
    navigation.goBack();
  };
  const onCancleCallback = () => {
    navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ActivityIndicator
          color={"#F05454"}
          size={50}
          animating={showActivityIndicator}
          style={{ position: "absolute", marginTop: 250, marginStart: 170 }}        />
        <View>
          {imageUri == "" && (
            <Image
              style={styles.avatar}
              source={require("../assets/avatar.png")}
            ></Image>
          )}
          {imageUri != "" && (
            <Image style={styles.avatar} source={{ uri: imageUri }}></Image>
          )}

          <TouchableOpacity onPress={openCamera}>
            <Ionicons
              name={"camera"}
              style={styles.cameraButton}
              size={50}
            ></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery}>
            <Ionicons
              name={"image"}
              style={styles.galleryBotton}
              size={50}
            ></Ionicons>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          onChangeText={setPostDescription}
          placeholder="Description"
          value={postDescription}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={onCancleCallback}>
            <Text style={styles.buttonText}>CANCLE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSaveCallback}>
            <Text style={styles.buttonText}>SAVE</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
  },
  avatar: {
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    width: "100%",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },

  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    margin: 12,
    padding: 12,
    backgroundColor: "#009999",
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
  cameraButton: {
    position: "absolute",
    bottom: -10,
    left: 10,
    width: 50,
    height: 50,
  },
  galleryBotton: {
    position: "absolute",
    bottom: -10,
    right: 10,
    width: 50,
    height: 50,
  },
});

export default EditPost;