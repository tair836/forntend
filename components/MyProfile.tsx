// import React, { FC, useState, useEffect } from 'react';
// import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, ScrollView } from 'react-native';
// import UserModel, {User} from '../models/UserModel';
// import { AntDesign } from '@expo/vector-icons';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import * as ImagePicker from 'expo-image-picker';

// const MyProfile: FC<{ route: any, navigation: any, id: any }> = ({ route, navigation, id }) => {

//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")
//     const [avatarUri, setAvatarUri] = useState("")
//     const [isShown, setIsShown] = useState(false);

//     const getData = async (id:String) => {
//         const user: any = await UserModel.getUserById(id)
//         setEmail(user['email'])
//         setAvatarUri(user['image'])
//     }
//     const handleClick = () => {
//         setIsShown(current => !current);
//     }
//     useEffect(()=>{
//         getData(id)
//     })

//     const askPermission = async () => {
//         try {
//             const res = await ImagePicker.getCameraPermissionsAsync()
//             if (!res.granted) {
//                 alert("camera permission is requiered!")
//             }
//         } catch (err) {
//             console.log("ask permission error " + err)
//         }
//     }
//     useEffect(() => {
//         askPermission()
//     }, [])

//     const openCamera = async () => {
//         try {
//             const res = await ImagePicker.launchCameraAsync()
//             if (!res.canceled && res.assets.length > 0) {
//                 const uri = res.assets[0].uri
//                 setAvatarUri(uri)
//             }

//         } catch (err) {
//             console.log("open camera error:" + err)
//         }
//     }

//     const openGallery = async () => {
//         try {
//             const res = await ImagePicker.launchImageLibraryAsync()
//             if (!res.canceled && res.assets.length > 0) {
//                 const uri = res.assets[0].uri
//                 setAvatarUri(uri)
//             }

//         } catch (err) {
//             console.log("open gallery error:" + err)
//         }
//     }

//     const onSaveCallback = async () => {
//         console.log("save button was pressed")
//         if (email == ""|| password == "") {
//             return;
//           }
//         const user: User = {
//             email: email,
//             password: password,
//             image: avatarUri,
//         }
//         try {
//             if (avatarUri != "") {
//                 console.log("uploading image")
//                 const url = await UserModel.uploadImage(avatarUri)
//                 user.image = url
//                 console.log("got url from upload: " + url)
//             }
//             console.log("saving user")
//             await UserModel.updateUser(user, id)
//         } catch (err) {
//             console.log("fail adding new user: " + err)
//         }
//         setIsShown(current => !current);
//        //navigation.goBack()
//     }

//     const onCancellCallback = () => {
//         //navigation.goBack()
//         setIsShown(current => !current);
//     }


//     const EditDetails: FC = () => {
//         return (
//             <ScrollView>
//               <View style={styles.container}>
//                 <View>      
//                   <TouchableOpacity onPress={openCamera}>
//                     <Ionicons name={"camera"} style={styles.cameraButton} size={50} />
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={openGallery}>
//                     <Ionicons name={"image"} style={styles.galleryButton} size={50} />
//                   </TouchableOpacity>
//                 </View>
      
//                 <TextInput
//                 style={styles.input}
//                 onChangeText={setEmail}
//                 value={email}
//                 placeholder={"Enter your email"}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   clearTextOnFocus
//                   onChangeText={setPassword}
//                   value={password}
                  
//                   placeholder={"Enter password"}
//                 />
//                 <View style={styles.buttonesContainer}>
//                   <TouchableOpacity onPress={onCancellCallback} style={styles.button}>
//                     <Text style={styles.buttonText}>CANCELL</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={onSaveCallback} style={styles.button}>
//                     <Text style={styles.buttonText}>UPDATE</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </ScrollView>
//           );
//     }

//     return (
//       <ScrollView>
//         <View style={styles.container}>
//           <Text style={styles.title1}>MY PROFILE</Text>
//             {avatarUri == "" && ( <Image source={require("../assets/ava.png")}style={styles.avatar} ></Image> )}
//             {avatarUri != "" && ( <Image source={{ uri: avatarUri }} style={styles.avatar}></Image> )}
//           <TouchableOpacity onPress={handleClick}>
//             <Text style={styles.Details}>
//               Email: {email} <AntDesign name="edit" size={24} color="#222831" />
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <View>{isShown ? <EditDetails></EditDetails> : null}</View>
//       </ScrollView>
//     );
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding:30,
//         backgroundColor: '#DDDDDD',
//     },
//     title1:{
//         color:'#F05454',
//         fontSize: 35,
//         textAlign: 'center'
//     },
//     Details:{
//         color: '#222831',
//         fontSize: 20,
//         textAlign: 'center',
//         marginTop:20
//     },
//     avatar: {
//         height: 250,
//         resizeMode: "contain",
//         alignSelf: 'center',
//         width: '100%'
//     },
//     cameraButton: {
//         position: 'absolute',
//         bottom: -10,
//         left: 10,
//         width: 50,
//         height: 50,
//     },
//     galleryButton: {
//         position: 'absolute',
//         bottom: -10,
//         right: 10,
//         width: 50,
//         height: 50,
//     },
//     input: {
//         height: 40,
//         margin: 12,
//         borderWidth: 1,
//         padding: 10,
//         borderRadius: 5,
//     },
//     buttonesContainer: {
//         flexDirection: 'row',
//     },
//     button: {
//         flex: 1,
//         margin: 12,
//         padding: 12,
//         backgroundColor: '#F05454',
//         borderRadius: 10,
//     },
//     buttonText: {
//         textAlign: 'center',
//         color: 'white'
//     }
// });
// export default MyProfile