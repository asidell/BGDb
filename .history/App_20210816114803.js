import React, {Component, useCallback, useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Image, StyleSheet, Text, View, ScrollView, TouchableOpacity,Linking,TextInput } from 'react-native';
import KoT from './assets/kingoftokyo.jpg';
import gameData from './assets/Games.csv';
import {fetchItem} from './AwsFunctions';


// AWS STARTS HERE
import * as AWS from 'aws-sdk'

const configuration = {
    region: 'eu-west-2',
    secretAccessKey: 'iSI8uG/ALk6N+XImfKIuKS0HKdsJNVTqiU1PC7KK',
    accessKeyId: 'AKIA3QXI36AOXXBU2GXU',
    
}
const creds = new AWS.Credentials({
  secretAccessKey: 'iSI8uG/ALk6N+XImfKIuKS0HKdsJNVTqiU1PC7KK',
  accessKeyId: 'AKIA3QXI36AOXXBU2GXU',
})
const docClient = new AWS.DynamoDB({
  region:'eu-west-2',
  credentials: creds,
  dynamoDbCrc32:false})

AWS.config.update(configuration)
// ENDS HERE

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

const App = () =>  {

  //AWS Functions
  async function fetchData(tableName, docClient){
    var params = {
        ExpressionAttributeNames: {
            '#im': 'Image',
            '#nm': 'Name'
        },
        ProjectionExpression: '#im, #nm',
        TableName: tableName
    }
    var imgNames = new Map()
    await docClient.scan(params, function (err, data) {
      if (!err) {
          data.Items.map((item)=> {
              const gameName = item["Name"]["S"];
              const gameImage = item["Image"]["S"];
              imgNames.set(gameImage,gameName);
          })
      }
      else{
          console.log("Error retrieving data")
          console.log(err)
      }
      console.log(imgNames.size)
      return(imgNames)
    })
      
  }

  //screens
  const MyHomeScreen = ({navigation}) => {
    //query db for icons and game names
    //setTimeout(function(){console.log('waited') }, 3000)
    // if (gameData.size ===70){
    //   return(
    //     <ScrollView>          
    //     {
    //       gameData.forEach((gameImage,gameName) => {
    //         <TouchableOpacity
    //         onPress={() => navigation.navigate('GameScreen', {name: {gameName}})}
    //         >
    //           <Image source= {gameImage} style={styles.thumbnail}/>
    //           <Text style= {styles.text}>{gameName}</Text>
    //         </TouchableOpacity>
    //       })}
          
    //       <Button title='Fetch Data' onPress={() => navigation.navigate('DataScreen')}/>
    //       <Button title='Fetch Item' onPress={() => fetchItem('Games',docClient)}/>
    //     </ScrollView>)}
    function printData(data){
      console.log(typeof data)
    }
    let gameData= fetchData('Games', docClient).then(console.log(gameData.size))
    return(
      <ScrollView>          
        {
          <TouchableOpacity
        onPress={() => navigation.navigate('GameScreen', {name: "King of Tokyo"})}
        >
          <Image source= {KoT} style={styles.thumbnail}/>
          <Text style= {styles.text}>King of Tokyo</Text>
        </TouchableOpacity>}
        <Button title='Fetch Data' onPress={() =>navigation.navigate('DataScreen',{data:fetchData('Games',docClient)})}/>
        <Button title='Print Data' onPress={() =>printData(fetchData('Games',docClient))}/>
        <Button title='Fetch Item' onPress={() => fetchItem('Games',docClient)}/>
      </ScrollView>
    );
  };

  const DataScreen = ({navigation, data}) => {
    var gameData = data
    var myData = fetchData('Games',docClient)
    return(
      <View>
        <Text>
          myData is {typeof myData}
        </Text>
        <Text>
          {fetchData('Games',docClient).size}
        </Text>
        <Text>
          gameData is {typeof gameData}
        </Text>
      </View>
        
    )

  }

  const LoadedDataScreen = ({navigation, gameData}) => {
    return(
      <Text>
        {gameData.size}
      </Text>
    )
  }

  const GameScreen = ({navigation, route}) => {
    const rulesURL= 'https://cdn.1j1ju.com/medias/f9/2f/9b-king-of-tokyo-rulebook.pdf';
    const gameName = String(route.params.name);
    //query db for more info 
  
    return(
      <ScrollView>
        <Text style= {styles.text}>{route.params.name}</Text>
        <Image source = {KoT} style= {styles.thumbnail}/>
        <Text style = {styles.decritption}>
          Description: {"\n\n"}
          In King of Tokyo, you play mutant monsters, gigantic robots, and strange aliens-all of whom are destroying Tokyo and whacking each other in order to become the one and only King of Tokyo.{"\n\n"}At the start of each turn, you roll six dice, which show the following six symbols: 1, 2, or 3 Victory Points, Energy, Heal, and Attack. Over three successive throws, choose whether to keep or discard each die in order to win victory points, gain energy, restore health, or attack other players into understanding that Tokyo is YOUR territory.{"\n\n"}The fiercest player will occupy Tokyo, and earn extra victory points, but that player can't heal and must face all the other monsters alone!{"\n\n"}Top this off with special cards purchased with energy that have a permanent or temporary effect, such as the growing of a second head which grants you an additional die, body armor, nova death ray, and more.... and it's one of the most explosive games of the year!{"\n\n"}In order to win the game, one must either destroy Tokyo by accumulating 20 victory points, or be the only surviving monster once the fighting has ended.{"\n\n"}First Game in the King of Tokyo series{"\n\n"}
        </Text>
        <OpenURLButton url={rulesURL}>{String("Rules for "+gameName)}</OpenURLButton>
      </ScrollView>  
    );
  };

  return(
    <NavigationContainer>
      <Stack.Navigator>
  
      <Stack.Screen
        name="My Home"
        component= {MyHomeScreen}
        />
        <Stack.Screen
        name="GameScreen"
        component= {GameScreen}
        />
        <Stack.Screen
        name="DataScreen"
        component= {DataScreen}
        />
        <Stack.Screen
        name="LoadedDataScreen"
        component= {LoadedDataScreen}
        />
      </Stack.Navigator>
        
    </NavigationContainer>
  );
  
}



export default App;

//Styles
const styles = StyleSheet.create({
  container0: {
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
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { height: 50, backgroundColor: '#ddd', marginBottom: 10, padding: 8 },
  todoName: { fontSize: 18 }
});



