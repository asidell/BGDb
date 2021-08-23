import React, {useCallback, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Image, StyleSheet, Text,View, ScrollView,TouchableOpacity,Linking } from 'react-native';
import KoT from './assets/kingoftokyo.jpg'
import AllGameData from './assets/Games.csv'
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

const App = () => {
  const [columns, setColumns] = useState([])
  const [ data, setData] = useState([])

  const processData = dataString => {
    const dataStringLines = dataString.split('\r|\n')
    const headers = dataStringLines[0].split(',')

    const list = []
    for (let i = 1; i<dataStringLines.length; i++) { //start at 1 bc line 0 is headers
      const row = dataStringLines[i].split("\",\"")
      if (headers && row.length == headers.length){ //do this is all of a game's info has been passed
        //make obj to hold game info
        const obj = {}
        for (let j = 0; j<headers.length; j++){
          let d = row[j]
          if (d.length>0) {//take out extra "" if needed
            if (d[0] == '\"')
              d = d.substring(1, d.length - 1)
            if (d[d.length - 1] == '\"')
              d = d.substring(d.length - 2, 1)
          }
          if (headers[j]) { //assign data to correct header
            obj[headers[j]] = d;
          } 
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
    const columns = headers.map(c => ({
      name: c,
      sector:c,
    }))

    setData(list)
    setColumns(columns)
  }

  const handleFile = () => {
    const file = AllGameData
    const reader = new FileReader()
    reader.onload = (evt) => {
      // Parse data 
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      // Get first worksheet 
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // Convert array of arrays
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);

  }

  //screens
  const MyHomeScreen = ({navigation}) => {
    //query db for icons and game names
    return(
      <ScrollView>
        <TouchableOpacity
        onPress={() => navigation.navigate('GameScreen', {name: "King of Tokyo"})}
        >
          <Image source= {KoT} style={styles.thumbnail}/>
          <Text style= {styles.text}>King of Tokyo</Text>
        </TouchableOpacity>
        <DataTable
          highlightonhover
          columns={columns}
          data= {data}
        />
      </ScrollView>
    );
  };

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
      </Stack.Navigator>
        
    </NavigationContainer>
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



