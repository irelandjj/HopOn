import { StyleSheet, Text, Platform, PermissionsAndroid } from 'react-native';
import DiscoverRidersScreen from './screens/Driver/DiscoverRidersScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { enableLatestRenderer } from 'react-native-maps';
import Router from './navigation/RootNavigator';
import { AwsConfig } from './config/AwsConfig';
enableLatestRenderer();
require('react-native-geolocation-service');

AwsConfig();

export default function App() {

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    }
    else {
      Geolocation.requestAuthorization("whenInUse");
    }
  }, []);


  return (
      <Router/>
  );
}