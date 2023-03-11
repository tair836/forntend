import PostApi from "../api/PostApi";
import FormData from "form-data";
import UserModel from "./UserModel";

export type Post = {
  userName: String;
  userEmail: String;
  message: String;
  image: String;
  postId: String;
  userImage: String;
};

export type NewPost = {
  message: String;
  imageUrl: String;
};

const createPostsList = async (res: any) => {
  let posts = Array<Post>();
  if (res.data) {
    console.log(" in  if (res.data)");
    console.log(res.data);
    const list = res.data.post;
    console.log(list);
    for (let i = 0; i < list.length; ++i) {
      console.log("element: " + list[i]._id);
      const userRes: any = await UserModel.getUserById(list[i].sender);
      const user: any = userRes.data;
      // console.log("user details");
      // console.log(user);
      console.log("user email - " + user.email);
      const st: Post = {
        userName: user.name,
        message: list[i].message,
        image: list[i].imageUrl,
        postId: list[i]._id,
        userImage: user.imageUrl,
        userEmail: user.email
      };
      console.log('mes', st.message)
      posts.push(st);
    }
  }
  return posts;
};

const getAllPosts = async () => {
  console.log("getAllPosts()!!");
  let res: any = await PostApi.getAllPosts();
  console.log("res: ");
  console.log(res);
  if (res.status == 410) {
    res = await UserModel.refresh();
    if (!res) {
      // error in refresh
      // TODO - need to handle it - maybe logout the user
      return res;
    }
    res = await PostApi.getAllPosts();
  }
  return createPostsList(res);
};

const getPostById = async (PostId: String) => {
  console.log("getPostById()");
  let res: any = await PostApi.getPostById(PostId);
  if (res.status == 410) {
    res = await UserModel.refresh();
    if (!res) {
      // error in refresh
      // TODO - need to handle it - maybe logout the user
      return;
    }
    res = await PostApi.getAllPosts();
  }
  return res;
};

const editPostById = async (postId: String, Post: any) => {
  console.log("editPostById()");
  console.log(postId, Post);
  let res: any = PostApi.editPost(postId, Post);
  if (res.status == 410) {
    console.log('410?')
    res = await UserModel.refresh();
    if (!res) {
      // error in refresh
      // TODO - need to handle it - maybe logout the user
      return;
    }
    res = await PostApi.editPost(postId, Post);
    console.log('TAIR', res)
  }
  return res;
};

const getAllUserPosts = async (sender: string) => {
  console.log("getAllUserPosts()");
  let res: any = await PostApi.getAllUserPosts(sender);
  if (res.status == 410) {
    res = await UserModel.refresh();
    if (!res) {
      // error in refresh
      // TODO - need to handle it - maybe logout the user
      return res;
    }
    res = await PostApi.getAllUserPosts(sender);
  }
  return createPostsList(res);
};

const addPost = async (newPost: any) => {
  console.log("addPost function");
  console.log("message: " + newPost.message);
  const data = {
    message: newPost.message,
    sender: newPost.userId,
    image: newPost.image,
  };
  try {
    let res: any = await PostApi.addPost(data);
    if (res.status == 410) {
      console.log("status 410 in addPost");
      res = await UserModel.refresh();
      if (!res) {
        // error in refresh
        // TODO - need to handle it - maybe logout the user
        return;
      }
      res = await PostApi.addPost(data);
    }
    console.log("res: ");
    console.log(res);
    return res;
  } catch (err) {
    console.log("add post fail " + err);
  }
};

const deletePost = async (postId: String) => {
  try {
    let res: any = await PostApi.deletePost(postId);
    if (res.status == 410) {
      res = await UserModel.refresh();
      if (!res) {
        // error in refresh
        // TODO - need to handle it - maybe logout the user
        return;
      }
      res = await PostApi.deletePost(postId);
    }
    return res;
  } catch (err) {
    console.log("add post fail " + err);
  }
};

const uploadImage = async (imageURI: String) => {
  var body = new FormData();
  body.append("file", {
    name: "name",
    type: "image/jpeg",
    uri: imageURI,
  });
  try {
    const res = await PostApi.uploadImage(body);
    if (!res.ok) {
      console.log("save failed " + res.problem);
    } else {
      if (res.data) {
        const d: any = res.data;
        console.log("url: " + d.url);
        return d.url;
      }
    }
  } catch (err) {
    console.log("save failed " + err);
  }
  return "";
};

export default {
  getAllPosts,
  addPost,
  uploadImage,
  getAllUserPosts,
  deletePost,
  getPostById,
  editPostById,
};