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
  }

  

  return(
    <View style={styles.container}>
      <Table>
        <Row data="Game Name"/>
        <Rows data={Games.entries[0]}/>
      </Table> 
    </View>
  );
};



export default App;

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
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



