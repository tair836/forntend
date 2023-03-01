import apiClient from "./ClientApi";

const addNewUser = async (userJson: any) => {
  return await apiClient.post("/auth/register", userJson);
};

const uploadImage = async (image: any) => {
  return await apiClient.post("/file/file", image);
};

const loginUser = async (credentials: any) => {
  return await apiClient.post("/auth/login", credentials);
};

const getUserById = async (userId: String) => {
  return await apiClient.get("/auth/" + userId);
};

const updateUserById = async (userId: String, userDetails: any) => {
  console.log(userId);
  return await apiClient.put("/auth/" + userId, userDetails);
};

const refresh = async () => {
  return await apiClient.get("/auth/refresh");
};

export default {
  addNewUser,
  uploadImage,
  loginUser,
  getUserById,
  updateUserById,
  refresh,
};