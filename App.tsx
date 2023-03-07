import { FC, useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Register from "./components/Register";
import Login from "./components/Login";
import apiClient from "./api/ClientApi";
import Profile from "./components/Setting";
import AddPost from "./components/AddPost";
import PostsList from "./components/AllPosts";
import MyPostsList from "./components/MyPosts";
import EditPost from "./components/EditPost";
import Chat from "./components/Chat";

const LoginStack = createNativeStackNavigator();

const PostStack = createNativeStackNavigator();
const PostStackCp: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const addNewPost = () => {
    navigation.navigate("AddPost");
  };
  return (
    <PostStack.Navigator>
      <PostStack.Screen
        name="PostsList"
        component={PostsList}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={addNewPost}>
              <Ionicons name={"add-outline"} size={40} color={"gray"} />
            </TouchableOpacity>
          ),
        }}
      />
      <PostStack.Screen name="AddPost" component={AddPost} />
    </PostStack.Navigator>
  );
};

// TODO - need to add edit post here
const MyPostsStack = createNativeStackNavigator();
const MyPostsStackCp: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const addNewPost = () => {
    navigation.navigate("AddPost");
  };
  return (
    <MyPostsStack.Navigator>
      <MyPostsStack.Screen
        name="MyPostsList"
        component={MyPostsList}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={addNewPost}>
              <Ionicons name={"add-outline"} size={40} color={"gray"} />
            </TouchableOpacity>
          ),
        }}
      />
      <MyPostsStack.Screen name="AddPost" component={AddPost} />
      <MyPostsStack.Screen name="EditPost" component={EditPost} />
    </MyPostsStack.Navigator>
  );
};

const updateToken = async (setToken: any) => {
  console.log("updateToken");
  const token = await AsyncStorage.getItem("accessToken");
  if (token != null) {
    apiClient.setHeader("Authorization", "JWT " + token);
    return setToken(token);
  }
};

const Tab = createBottomTabNavigator();
const App: FC = () => {
  const [token, setToken] = useState();
  updateToken(setToken);
  if (!token) {
    return (
      <NavigationContainer>
        <LoginStack.Navigator>
          <LoginStack.Screen name="Login">
            {(props) => (
              <Login
                route={props.route}
                navigation={props.navigation}
                setToken={setToken}
              />
            )}
          </LoginStack.Screen>
          <LoginStack.Screen name="Register" component={Register} />
        </LoginStack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: any = "";
              if (route.name === "MyPostsStackCp") {
                iconName = focused ? "albums" : "albums-outline";
              } else if (route.name === "PostStackCp") {
                iconName = focused ? "list-circle" : "list-circle-outline";
              } else if (route.name === "Profile") {
                iconName = focused ? "person" : "person-outline";
              } else if (route.name === "Chat") {
                iconName = focused
                  ? "chatbox-ellipses"
                  : "chatbox-ellipses-outline";
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#009999",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen
            name="PostStackCp"
            component={PostStackCp}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="MyPostsStackCp"
            component={MyPostsStackCp}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Profile">
            {(props) => (
              <Profile
                route={props.route}
                navigation={props.navigation}
                setToken={setToken}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Chat" component={Chat} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
  },
});

export default App;