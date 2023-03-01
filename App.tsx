import { FC, useState, useEffect } from "react";
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
  TouchableHighlight,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Register from "./components/Register_component";
import Login from "./components/Login_component";
import apiClient from "./api/ClientApi";

const LoginStack = createNativeStackNavigator();

const updateToken = async (setToken: any) => {
  const token = await AsyncStorage.getItem("accessToken");
  await AsyncStorage.clear();
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
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
  },
});

export default App;