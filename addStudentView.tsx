import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput } from 'react-native';

const App2 = () => {
    console.log("My app is running")
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")

    const onPressCallback = () => {
        console.log("button was pressed")
    }

    return (
        <View style={styles.container}>
            <Image source={require('./assets/ava.png')} style={styles.avatar}></Image>
            <TextInput
                style={styles.input}
                onChangeText={setId}
                value={id}
                placeholder={'Student ID'}
            />
            <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder={'Student Name'}
            />
            <TextInput
                style={styles.input}
                onChangeText={setAddress}
                value={address}
                placeholder={'Student Address'}
            />
            <View style={styles.buttonesContainer}>
                <TouchableOpacity onPress={onPressCallback} style={styles.button}>
                    <Text style={styles.buttonText}>CANCELL</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressCallback} style={styles.button}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatar: {
        height: 250,
        resizeMode: "contain",
        alignSelf: 'center'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    buttonesContainer: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        margin: 12,
        padding: 12,
        backgroundColor: 'blue',
        borderRadius: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    }
});

export default App2
