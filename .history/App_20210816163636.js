import React, {Component, useCallback, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Image, StyleSheet, Text, View, ScrollView,TouchableOpacity,Linking} from 'react-native';
import KoT from './assets/kingoftokyo.jpg'
import Games from './assets/Games.json'
//import Table from '@hesenger/react-simpletable/dist'
import { Table, Row, Rows } from 'react-native-table-component'
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
    this.state = {
      tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
      tableData: [
        ['1', '2', '3', '4'],
        ['a', 'b', 'c', 'd'],
        ['1', '2', '3', '456\n789'],
        ['a', 'b', 'c', 'd']
      ]
    }
  }

  
  render(){
    const state = this.state;
    return(
      <View style={styles.container}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data="Game Name" style={styles.head} textStyle={styles.text}/>
          <Rows data={state.tableData[0]} textStyle={styles.text}/>
        </Table>

      </View>
    );
  }
};

//Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
 
  thumbnail: {
    width: 300,
    height: 300,
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



