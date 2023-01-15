import { FC, useState } from 'react';
import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput } from 'react-native';


const Brick: FC<{ onClick: () => void, getCurrentPlayer: () => number }> = (props) => {
  const [player, setPlayer] = useState(0)
  const onClick = () => {
    setPlayer(props.getCurrentPlayer())
    props.onClick()
  }
  const getBackground = () => {
    if (player == 0) {
      return 'white'
    } else if (player == 1) {
      return 'red'
    }
    return 'green'
  }
  return (
    <View style={styles.brick}>
      <TouchableOpacity style={[styles.button, { backgroundColor: getBackground() }]} onPress={onClick}>
      </TouchableOpacity>
    </View>
  )
}
const XmixDrix: FC = () => {
  // 0: not selected, 1: 'x', 2: 'o'
  var turn = 1

  const getCurrentPlayer = () => {
    return turn
  }
  const onBrickClick = () => {
    console.log('onBrickClick')
    if (turn == 1) {
      turn = 2
    } else {
      turn = 1
    }
  }

  console.log("My app is running")

  const onPressCallback = () => {
    console.log("button was pressed")
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Brick onClick={onBrickClick} getCurrentPlayer={getCurrentPlayer}></Brick>
        <Brick onClick={onBrickClick} getCurrentPlayer={getCurrentPlayer}></Brick>
        <Brick onClick={onBrickClick} getCurrentPlayer={getCurrentPlayer}></Brick>
      </View>
      <View style={styles.row}>
        <Brick onClick={onBrickClick} getCurrentPlayer={getCurrentPlayer}></Brick>
        <Brick onClick={onBrickClick} getCurrentPlayer={getCurrentPlayer}></Brick>
        <Brick onClick={onBrickClick} getCurrentPlayer={getCurrentPlayer}></Brick>
      </View>
      <View style={styles.row}>
        <Brick onClick={onBrickClick} getCurrentPlayer={getCurrentPlayer}></Brick>
        <Brick onClick={onBrickClick} getCurrentPlayer={getCurrentPlayer}></Brick>
        <Brick onClick={onBrickClick} getCurrentPlayer={getCurrentPlayer}></Brick>
      </View>
    </View >
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: 'grey',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'blue',
  },
  brick: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    aspectRatio: 1,
  },
  button: {
    flex: 1,
  },
});

export default XmixDrix
