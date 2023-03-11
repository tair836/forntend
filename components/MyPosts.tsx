import { FC, useState } from "react";
import { StatusBar,StyleSheet,Text,View,Image,TouchableOpacity,FlatList,TouchableHighlight,ActivityIndicator}from "react-native";
import React from "react";
import PostModel, { Post } from "../models/PostModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

const ListItem: FC<{name: String; description: String;image: String;userImage: String;postId: String;onDelete: any;onEdit: any;}>
 = ({ name, description, image, userImage, postId, onDelete, onEdit }) => {

  const onDeletePress = async () => {
    try {
      const res = await PostModel.deletePost(postId);
      console.log("deleted");
      onDelete();
    } catch (err) {
      console.log("fail in delete");
    }
  };

  const onEditPress = async () => {
    try {
      onEdit(postId);
    } catch (err) {
      console.log("fail in edit");
    }
  };

  return (
    <TouchableHighlight underlayColor={"#DDDDDD"}>
      <View style={styles.list}>
        <View style={styles.listRow}>
        {userImage == '' ?  <Image source={require("../assets/avatar.png")} style={styles.userImage}></Image>
    : <Image source={{ uri: userImage.toString() }} style={styles.userImage}></Image>} 
          <Text style={styles.userName}>{name}</Text>
          <TouchableOpacity
            style={{ left: 90, marginTop: 5 }}
            onPress={onDeletePress}
          >
            <AntDesign name={"delete"} size={30} color={"#F05454"}></AntDesign>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ left: 95, margin: 5 }}
            onPress={onEditPress}
          >
            <AntDesign name={"edit"} size={30} color={"#F05454"}></AntDesign>
          </TouchableOpacity>
        </View>
        <View style={styles.listRowTextContainer}>
        {image == '' ?  <Image source={require("../assets/avatar.png")} style={styles.postImage}></Image>
    : <Image source={{ uri: image.toString() }} style={styles.postImage}></Image>} 
        
          <Text style={styles.postContext}>{description}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const MyPosts: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const [posts, setPosts] = useState<Array<Post>>();
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);

  const onEdit = async (postId: String) => {
    console.log('trtrtrtrtrtrtr')
    navigation.navigate("EditPost", { postId: postId });
  };

  const fetchMyPosts = async () => {
    setShowActivityIndicator(true);
    let posts: Post[] = [];
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.log("failed fetching my posts "); // TODO
        return;
      }
      posts = await PostModel.getAllUserPosts(userId);
    } catch (err) {
      console.log("fail fetching my posts " + err);
    }
    setPosts(posts);
    setShowActivityIndicator(false);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setShowActivityIndicator(true);
      await fetchMyPosts();
      setShowActivityIndicator(false);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatlist}
        data={posts}
        keyExtractor={(post) => post.postId.toString()}
        renderItem={({ item }) => (
          <ListItem
            name={item.userEmail}
            description={item.message}
            image={item.image}
            userImage={item.userImage}
            postId={item.postId}
            onDelete={fetchMyPosts}
            onEdit={onEdit}
          />
        )}
      ></FlatList>
      <ActivityIndicator
        color={"#F05454"}
        size={50}
        animating={showActivityIndicator}
        style={{ position: "absolute", marginTop: 250, marginStart: 170 }}      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    margin: 2,
    flex: 1,
    elevation: 1,
    borderRadius: 2,
  },
  listRow: {
    flexDirection: "row",
  },
  userImage: {
    margin: 10,
    resizeMode: "contain",
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  postImage: {
    height: 250,
    width: 320,
    alignSelf: "center",
  },
  listRowTextContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
  userName: {
    fontSize: 25,
    marginTop: 10,
  },
  postContext: {
    fontSize: 24,
    margin: 4,
    marginLeft: 10,
  },
  flatlist: {
    flex: 1,
  },
  picker: {
    left: 10,
  },
});

export default MyPosts;