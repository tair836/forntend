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
import AllPosts from "./components/AllPosts";
import MyPosts from "./components/MyPosts";
import EditPost from "./components/EditPost";
import Chat from "./components/Chat";

const LoginStack = createNativeStackNavigator();
const PostStack = createNativeStackNavigator();

const Posts: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const addNewPost = () => {
    navigation.navigate("AddPost");
  };
  return (
    <PostStack.Navigator>
      <PostStack.Screen
        name="AllPosts"
        component={AllPosts}
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
const MyPost: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const addNewPost = () => {
    navigation.navigate("AddPost");
  };
  return (
    <MyPostsStack.Navigator>
      <MyPostsStack.Screen
        name="MyPosts"
        component={MyPosts}
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
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          switch(route.name){
            case 'Profile':
              iconName = focused ? 'person-circle' : 'person-circle-outline'
              break
            case 'MyPost':
              iconName = focused ? 'image' : 'image-outline'
              break
            case 'Posts':
              iconName = focused ? 'images' : 'images-outline'
              break
            case 'Chat':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'
              break
          }
          // You can return any component that you like here! 
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F05454',
        tabBarInactiveTintColor: '#30475E',
      })}>
          <Tab.Screen
            name="Posts"
            component={Posts}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="MyPost"
            component={MyPost}
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