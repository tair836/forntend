import Auth_api from "../api/Auth_api"
import FormData from "form-data"
import apiClient from "../api/ClientApi"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type User = {
    email: String,
    password: String,
    image: String,
}

const addNewUser = async (user: User) => {
    console.log("addNewUser")
    const data = {
        email: user.email,
        password: user.password,
        avatarUrl: user.image
    }
    try {
        await Auth_api.addNewUser(data)
    } catch (err) {
        console.log("add user fail: " + err)
    }
}

const uploadImage = async (imageURI: String) => {
    var body = new FormData();
    body.append('file', { name: "name", type: 'image/jpeg', uri: imageURI });
    try {
        const res = await Auth_api.uploadImage(body)
        if (!res.ok) {
            console.log("save failed " + res.problem)
        } else {
            if (res.data) {
                const d: any = res.data
                console.log("----= url:" + d.url)
                return d.url
            }
        }
    } catch (err) {
        console.log("save failed " + err)
    }
    return ""
}
const loginUser = async (email: String, password: String) => {
    const data = {
      email: email,
      password: password,
    }
    try {
      const res: any = await Auth_api.loginUser(data)
      return res.data
    } catch (err) {
      console.log("login user fail: " + err);
      return null;
    }
}

const refresh = async () => {
    console.log("refresh");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log(refreshToken);
    apiClient.setHeader("Authorization", "JWT " + refreshToken);
  
    const res: any = await Auth_api.refresh();
    if (res.status == 400) {
      console.log("error in refresh");
      console.log(res);
      return; //?????????/ TODO
    }
    console.log("end refresh");
    console.log(res);
    // TODO - duplicte code!! maybe move to an new function with login
    apiClient.setHeader("Authorization", "JWT " + res.data.accessToken);
    await AsyncStorage.setItem("accessToken", res.data.accessToken);
    await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
  
    // check if needed here
    return res;
}

const getUsertById = async (id:String) => {
    console.log('getUsertById')
    let user = ''
    try {
        const res: any = await Auth_api.getUserById(id)
        if (res.data.code == 200) {
            const user: User = {
              email: res.data.data.email,
              password: res.data.data.password,
              image: res.data.data.avatarUrl,
            }
            return user
        }
        else if (res.status == 410) await refresh()
    } catch (err) { console.log("save failed " + err) }
    return user
}

const updateUser = async (user: User, id:String) => {
    console.log("updateAUser")
    const data = {
        email: user.email,
        password: user.password,
        avatarUrl: user.image
    }
    try {
        await Auth_api.updateUserById(id, data)
    } catch (err) {
        console.log("update user fail: " + err)
    }
}

export default { addNewUser, uploadImage, getUsertById, updateUser, loginUser, refresh}