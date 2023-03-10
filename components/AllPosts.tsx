import { FC, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";

import PostModel, { Post } from "../models/PostModel";

const ListItem: FC<{
  userImage: String;
  userEmail: String;
  text: String;
  postImage: String;
}> = ({ userEmail, userImage, text, postImage }) => {
  return (
    <TouchableHighlight underlayColor={"#DDDDDD"}>
      <View style={styles.list}>
        <View style={styles.listRow}>
        {userImage == '' ?  <Image source={require("../assets/avatar.png")} style={styles.userImage}></Image>
    : <Image source={{ uri: userImage.toString() }} style={styles.userImage}></Image>} 
          <Text style={styles.listRowName}>{userEmail}</Text>
        </View>
        <View style={styles.listRowTextContainer}>
        {postImage == '' ?  <Image source={require("../assets/avatar.png")} style={styles.postImage}></Image>
    : <Image source={{ uri: postImage.toString() }} style={styles.postImage}></Image>} 
          <Text style={styles.listRowName}>{text}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const AllPosts: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const [posts, setPosts] = useState<Array<Post>>();
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setShowActivityIndicator(true);
      let posts: Post[] = [];
      try {
        posts = await PostModel.getAllPosts();
        console.log("fetching posts complete");
      } catch (err) {
        console.log("fail fetching posts " + err);
      }
      console.log("fetching finish");
      setPosts(posts);
      setShowActivityIndicator(false);
    });
    return unsubscribe;
  });

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatlist}
        data={posts}
        keyExtractor={(post) => post.postId.toString()}
        renderItem={({ item }) => (
          <ListItem
            userEmail={item.userEmail}
            text={item.message}
            postImage={item.image}
            userImage={item.userImage}
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
  flatlist: {
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
  listRowImage: {
    margin: 5,
    resizeMode: "contain",
    height: 130,
    width: 130,
  },
  listRowTextContainer: {
    flex: 1,
    margin: 10,
    justifyContent: "space-around",
  },
  listRowName: {
    marginTop: 10,
    fontSize: 25,
  },
  listRowId: {
    fontSize: 25,
  },
  postImage: {
    height: 250,
    width: 300,
    alignSelf: "center",
  },
  userImage: {
    margin: 10,
    resizeMode: "contain",
    height: 50,
    width: 50,
    borderRadius: 30,
  },
});

export default AllPosts;