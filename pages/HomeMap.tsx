import { StatusBar } from 'expo-status-bar';
import { Platform, Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Audio } from 'expo-av';
import { AppRegistry } from 'react-native';
import { ProgressBar, MD3Colors, PaperProvider } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { WizardStore } from "../storage";
import MapView, {Marker} from 'react-native-maps';
import * as Location from "expo-location";
import GetLocation from 'react-native-get-location';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const foca = require("../images/mascote_foca.png")
const soundStart = require("../sounds/crank-2.mp3")
const soundTrompeth = require("../sounds/77711__sorohanro__solo-trumpet-06in-f-90bpm.mp3")
const soundRing = require("../sounds/telephone-ring-1.mp3")

let pomodoroTime = WizardStore.getRawState().session_object.pomodoroTime;
let restTime=WizardStore.getRawState().session_object.restTime;

const TaskPanel = ( (rdata) =>{
  return (
    <View>
      <Text>Tarefa { WizardStore.getRawState().post_object.post_title }</Text>
    </View>
  )
})

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [rdata, setRdata] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 41.8905,
    longitude: 12.4942,
    latitudeDelta: 30,
    longitudeDelta: 12
  });

  const userLocation = async() => {
    let {status} = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted") {
      console.log("need location");
      return;
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy:true});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.018,
      longitudeDelta: 0.002
    })
  }

  useEffect(() => {
    load_session();
    userLocation();
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  async function load_session() {
    console.log("r1");

    var options = {
      method: 'GET',
      url: 'https://autolavaggio.franciscomatelli.com.br/wp-json/wp/v2/booking',
      // params: {
      //   action: 'load_session',
      //   // t: WizardStore.getRawState().token
      // },
    };
    console.log("options", options)
    axios.request(options)
    .then(function (r) {
      setRdata(r.data);
      console.log("r.data[0]", r.data[0]);
      // let secsP = r.data.secondsRemainingFromPHP;
      // let post_status = r.data.post_object.post_status;
      // console.log("secsP", secsP);
      // console.log("post_status", post_status);
      WizardStore.update((s)=>{
        s.post_object = r.data[0]
      })
    }).catch(function (error) {
      console.error(error);
    });
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text> */}
        <StatusBar style="auto" />
        <MapView style={styles.map} 
          region={mapRegion}
        >
          <Marker title="Io" coordinate={mapRegion} />
        </MapView>
        {/* <Button onPress={userLocation} title="Get location" /> */}
        <Button title="Adicionar Macchina" />
        <Text>Lista de carros ícones accordion</Text>
        {/* tem que ser no car details <Button title="Solicitar Lavaggio" /> */}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDD',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  countdownCircleTimer: {
    width:1000,
    backgroundColor: "#09d",
  },
  buttonFloat: {
    position: "absolute",
    zIndex: 10,
    width: 500,
    height: 300,
    backgroundColor: "transparent",
  },
  mascotView: {
     flex:1,
     backgroundColor: "red",
     flexDirection: "row", 
     height: 10,
  },
  mascotImage: {
    width: 100,
    height: 100,
  },
  mascotText: {
    padding:10,
    margin:10,
    width:200,
    height:80,
    borderRadius:5,
    backgroundColor:"#EEE",
  },
  titleText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: '80%',
  },
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 10 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}