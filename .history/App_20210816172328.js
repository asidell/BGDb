import React, {Component, useCallback, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Image, StyleSheet, Text, View, ScrollView,TouchableOpacity,Linking, Alert} from 'react-native';
import KoT from './assets/kingoftokyo.jpg'
import Games from './assets/Games.json'
//import Table from '@hesenger/react-simpletable/dist'
import { Table, Row, Rows, TableWrapper, Cell } from 'react-native-table-component'
import * as XLSX from 'xlsx'
// import config from './src/aws-exports'
// Amplify.configure(config)

//Linking
const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props){
    super(props)
  }

  
  render(){
    var gameNames = []
    var gameImages = []
    for (let i = 0; i<Games.length; i++){
      gameNames.push([Games[i]["Name (S)"]])
    }
    for (let i = 0; i<Games.length; i++){
      gameImages.push([Games[i]["Image (S)"]])
    }
    const element = (index) => (
      <TouchableOpacity onPress={()=> Alert.alert("You pressed it")}>
        <Image style={styles.thumbnail} source = {{uri: concat('\'',Games[0]["Image (S)"],'\'')}}/>
        <Text style={styles.text}>{Games[0]["Name (S)"]}</Text>
      </TouchableOpacity>
    )
    console.log(Games[0]["Image (S)"])
    
    return(
      <View style={styles.container}>
        <ScrollView>
          <TouchableOpacity onPress={()=> Alert.Alert(index)}>
            <Image style={styles.thumbnail} source = {{uri: ('\''+Games[0]["Image (S)"]+'\'')}}/>
            <Text style={styles.text}>{Games[0]["Name (S)"]}</Text>
          </TouchableOpacity>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Rows data={gameNames} textStyle={styles.text}/>
            <Rows data={gameImages} textStyle={styles.text}/>
          </Table>
          
        </ScrollView>
      </View>
    );
  }
};

//Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
 
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: "contain"
  } ,

  text: {
    color:'#888',
    fontSize: 24
  },
  
  description: {
    color:'#888',
    fontSize:14
  },
});



