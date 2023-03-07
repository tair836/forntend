import { FC, useState } from "react";

import React from "react";
import PostModel, { NewPost, Post } from "../models/PostModel";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "../models/ChatModel";
import * as io from "socket.io-client";
import UserModel from "../models/UserModel";

let currentUserId: String | null;
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

const ListItem: FC<{
  sender: String;
  message: String;
  image: String;
  senderId: String;
}> = ({ sender, message, image, senderId }) => {
  
  return (
    <TouchableHighlight underlayColor={"gainsboro"}>
      <View
        style={{
          margin: 8,
          flex: 1,
          elevation: 1,
          width: 350,
          borderRadius: 8,
          backgroundColor: senderId == currentUserId ? "#659090" : "#EDE1D4",
          marginRight: senderId == currentUserId ? 0 : 30,
          marginLeft: senderId == currentUserId ? 50 : 10,
        }}
      >
        <View style={styles.listRow}>
          {image == "" && (
            <Image
              style={styles.userImage}
              source={require("../assets/avatar.png")}
            />
          )}
          {image != "" && (
            <Image
              style={styles.userImage}
              source={{ uri: image.toString() }}
            />
          )}
          <Text style={styles.userName}>{sender}</Text>
        </View>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </TouchableHighlight>
  );
};

const Chat: FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const [messages, setMessages] = useState<Array<Message>>();
  const [newMessage, setNewMessage] = useState("");
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);

  const clientSocketConnect = (
    clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>
  ): Promise<string> => {
    return new Promise((resolve) => {
      clientSocket.on("connect", () => {
        resolve("1");
      });
    });
  };

  const connectUser = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    socket = Client("http://192.168.128.1:3000", {
      auth: {
        token: "barrer " + token,
      },
    });
    console.log("before connection");
    await clientSocketConnect(socket);
    console.log("after connection");
    return socket;
  };

  const sendMessage = () => {
    console.log("***********sendMessage**********************");
    console.log(socket);

    if (socket != undefined) {
      console.log("test chat send message");

      if (newMessage == "") {
        console.log("message is empty");
        return;
      }

      socket.emit("chat:send_message", {
        message: newMessage,
      });
    }
  };

  const addUsernameToMessages = async (res: any) => {
    let messages = Array<Message>();
    console.log(res);
    if (res) {
      for (let i = 0; i < res.length; ++i) {
        const response: any = await UserModel.getUserById(res[i].sender);
        const user: any = response.data;
        const mes: Message = {
          senderId: res[i].sender,
          sender: user.name,
          message: res[i].message,
          image: user.imageUrl,
          messageId: res[i]._id,
        };
        messages.push(mes);
      }
    }
    return messages;
  };

  const fetchMessages = (socket: any) => {
    setShowActivityIndicator(true);
    socket.once("chat:get_all.response", async (arg: any) => {
      setMessages(await addUsernameToMessages(arg.body));
      setShowActivityIndicator(false);
    });
    socket.emit("chat:get_all");
  };

  const updateUserId = async () => {
    currentUserId = await AsyncStorage.getItem("userId");
  };

  React.useEffect(() => {
    updateUserId();
    const subscribe = navigation.addListener("focus", async () => {
      setShowActivityIndicator(true);
      socket = await connectUser();
      //Register to each time that essage sent in the room
      socket.on("chat:message", (arg) => {
        console.log("new message id === " + arg.res.body._id); // message id
        fetchMessages(socket);
        setNewMessage("");
      });
      if (socket != undefined) {
        fetchMessages(socket);
      }
      setShowActivityIndicator(false);
    });

    const unsubscribe = navigation.addListener("blur", () => {
      if (socket != undefined) socket.close();
    });

    return subscribe;
  }, [navigation, socket]);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatlist}
        data={messages}
        keyExtractor={(message) => message.messageId.toString()}
        renderItem={({ item }) => (
          <ListItem
            sender={item.sender}
            message={item.message}
            image={item.image}
            senderId={item.senderId}
          />
        )}
      ></FlatList>
      <View style={styles.listRow}>
        <TextInput
          style={styles.input}
          onChangeText={setNewMessage}
          placeholder="new message"
          value={newMessage}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name={"send"} style={styles.button} size={40}></Ionicons>
        </TouchableOpacity>
      </View>
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
    marginTop: StatusBar.currentHeight,
    flex: 1,
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
  userName: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10,
  },
  messageText: {
    fontSize: 21,
    marginLeft: 10,
    marginTop: 5,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  button: {
    flex: 10,
    margin: 12,

    // width: 5,
    // height: 5,
  },
  flatlist: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});

export default Chat;