import { StatusBar } from 'expo-status-bar';
import { Platform, React, Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert, Title } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { AppRegistry } from 'react-native';
import { ProgressBar, MD3Colors, PaperProvider } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import { RootSiblingParent } from 'react-native-root-siblings';

import { store } from './api/store'
import { Provider, useSelector } from 'react-redux'
//import { getVehicles } from "./store/vehicle/vehicleSlice";

const Stack = createStackNavigator();

import Login from "./screens/Login"
import HomeMap from "./screens/HomeMap";
import AddCar from "./screens/AddCar"
import AddCarDetails from "./screens/AddCarDetails"
import Profile from './screens/Profile';
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //const vehiclesss = useSelector(getVehicles);
  return (
    <Provider store={store}>
      <PaperProvider>
        <RootSiblingParent>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="HomeMap" component={HomeMap} />
              <Stack.Screen name="AddCar" component={AddCar} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="AddCarDetails" component={AddCarDetails} />
            </Stack.Navigator>
          </NavigationContainer>
        </RootSiblingParent>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
    //
    backgroundColor: '#DDD',
    alignItems: 'center',
  },
});