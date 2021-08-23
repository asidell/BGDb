import React, {Component, useCallback, useState} from 'react';
import { NavigationContainer, NavigationHelpersContext, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Image, StyleSheet, Text, View, ScrollView,TouchableOpacity,Linking, Alert} from 'react-native';
import Games from './assets/Games.json'
import { Table, Row, Rows, TableWrapper, Cell } from 'react-native-table-component'

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

    function goToButton(){
      naviagtion = useNavigation()
      return(
        <TouchableOpacity onPress={()=> navigation.navigate('Game Screen')}>
          <Image style={styles.thumbnail} source = {{uri: Games[game]["Image (S)"]}}/>
          <Text style={styles.text}>{Games[game]["Name (S)"]}</Text>
        </TouchableOpacity>
      );
    }

    function makeElements(gameData,{navigation}){
      let allData=[]
      for(let i=0;i<gameData.length;i++){
        allData.push([
          <TouchableOpacity onPress={()=> navigation.navigate('Game Screen')}>
            <Image style={styles.thumbnail} source = {{uri: Games[i]["Image (S)"]}}/>
            <Text style={styles.text}>{Games[i]["Name (S)"]}</Text>
          </TouchableOpacity>
          ],
          Games[i]["gameID (S)"] 
        )
      }
      return(allData);
    }

    const element = (game) => (
      <TouchableOpacity onPress={()=> Alert.alert("This is a game")}>
        <Image style={styles.thumbnail} source = {{uri: Games[game]["Image (S)"]}}/>
        <Text style={styles.text}>{Games[game]["Name (S)"]}</Text>
      </TouchableOpacity>
    )

    const yummyGameStuff = (game) => (
      {
        gameName: Games[game]["Name (S)"],
        gameID: Games[game]["gameID (S)"],
        gameImage: Games[game]["Image (S)"],
        gameElement: [element(game)]
      }
    )

    var gameData = []
    for(let i = 0; i<Games.length;i++){
      gameData.push([element(i)])
    }
    

    

    //Screens

    function HomeScreen({navigation}) {
      let allMyThings = makeElements(Games,{navigation})


      console.log(allMyThings)
      return (
        <View style={styles.container}>
          <ScrollView>
            <Button onPress={()=> navigation.navigate('Game Screen')} title="take me away"/>
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
              <Row data={allMyThings[0][0]} textStyle={styles.text}/> 
              <Rows data={[allMyThings][0]} textStyle={styles.text}/>
              
            </Table>
          </ScrollView>
        </View>
      );
    }

    function GameScreen({navigation}) {
      return(
        <View style ={styles.container}>
          <ScrollView>
            <Text>This is a game screen</Text>
          </ScrollView>
        </View>
      );
    }
    
    
    
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game Screen" component={GameScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
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



