import apiClient from "./ClientApi";

const getAllPosts = async () => {
  return await apiClient.get("/post");
};

const getPostById = async (postId: String) => {
  return await apiClient.get("/post/" + postId);
};

const getAllUserPosts = async (sender: string) => {
  return await apiClient.get("/post?sender=" + sender);
};

const addPost = async (postJson: any) => {
  return await apiClient.post("/post", postJson);
};

const deletePost = async (postId: String) => {
  return await apiClient.delete("/post/" + postId);
};

const editPost = async (postId: String, editedPost: any) => {
  return await apiClient.put("/post/" + postId, editedPost);
};

const uploadImage = async (image: any) => {
  return apiClient.post("/file/file", image);
};

export default {
  getAllPosts,
  addPost,
  uploadImage,
  getAllUserPosts,
  deletePost,
  getPostById,
  editPost,
};