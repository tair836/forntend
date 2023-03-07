import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./ClientApi";

const addUser = async (userJson: any) => {
  return await apiClient.post("/auth/register", userJson);
};

const uploadImage = async (image: any) => {
  return await apiClient.post("/file/file", image);
};

const loginUser = async (credentials: any) => {
  return await apiClient.post("/auth/login", credentials);
};

const logout = async () => {
  return await apiClient.get("/auth/logout");
};

const getUserById = async (userId: String) => {
  return await apiClient.get("/auth/" + userId);
};

const updateUserById = async (userId: String, userDetails: any) => {
  return await apiClient.put("/auth/" + userId, userDetails);
};

const refresh = async () => {
  return await apiClient.get("/auth/refresh");
};

export default {
  addUser,
  uploadImage,
  loginUser,
  getUserById,
  updateUserById,
  refresh,
  logout,
};