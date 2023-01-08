import { FC, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, FlatList, TouchableHighlight } from 'react-native';

import StudentModel, { Student } from './model/StudentModel';

const ListItem: FC<{ name: String, id: String, image: String, onRowSelected: (id: String) => void }> =
    ({ name, id, image, onRowSelected }) => {
        const onClick = () => {
            console.log('int he row: row was selected ' + id)
            onRowSelected(id)
        }
        return (
            <TouchableHighlight onPress={onClick} underlayColor={'gainsboro'}>
                <View style={styles.listRow}>
                    <Image style={styles.listRowImage}
                        source={require('./assets/ava.png')} />
                    <View style={styles.listRowTextContainer}>
                        <Text style={styles.listRowName}>{name}</Text>
                        <Text style={styles.listRowId}>{id}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }


const StudentList: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const onRowSelected = (id: String) => {
        console.log("in the list: row was selected " + id)
        navigation.navigate('StudentDetails', { studentId: id })
    }

    const [students, setStudents] = useState<Array<Student>>();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('focus')
            setStudents(StudentModel.getAllStudents())
        })
        return unsubscribe
    })
    return (
        <FlatList style={styles.flatlist}
            data={students}
            keyExtractor={student => student.id.toString()}
            renderItem={({ item }) => (
                <ListItem name={item.name} id={item.id} image={item.image} onRowSelected={onRowSelected} />
            )}
        >
        </FlatList>
    );
};


const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: 'grey',
    },
    flatlist: {
        flex: 1,
    },
    listRow: {
        margin: 4,
        flexDirection: "row",
        height: 150,
        elevation: 1,
        borderRadius: 2,
    },
    listRowImage: {
        margin: 10,
        resizeMode: "contain",
        height: 130,
        width: 130,
    },
    listRowTextContainer: {
        flex: 1,
        margin: 10,
        justifyContent: "space-around"
    },
    listRowName: {
        fontSize: 30
    },
    listRowId: {
        fontSize: 25
    }


});

export default StudentList