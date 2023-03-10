import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import PublishRiderTripScreen from "../screens/PublishRiderTripScreen";
import DiscoverRidersScreen from '../screens/DiscoverRidersScreen';
import HomeScreen from '../screens/HomeScreen';
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';
import { Screen, ScreenStack } from "react-native-screens";

export type RootStackParamList = {
    Home: undefined;
    Discover: undefined;
    Publish: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    
    return (
        <NavigationContainer>
            <RootStack.Navigator
                screenOptions={
                    { headerShown: false }
                }>
                <RootStack.Screen name="Home" component={HomeScreen} />
                <RootStack.Screen name="Discover" component={DiscoverRidersScreen} />
                <RootStack.Screen name="Publish" component={PublishRiderTripScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;