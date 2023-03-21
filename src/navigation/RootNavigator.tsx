import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import PublishRiderTripScreen from "../screens/PublishRiderTripScreen";
import DiscoverRidersScreen from '../screens/DiscoverRidersScreen';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoadingScreen from '../screens/LoadingScreen';
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';
import AuthenticationScreen from "../screens/AuthenticationScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

export type RootStackParamList = {
    ForgotPassword: undefined,
    Authentication: undefined;
    Loading: undefined;
    SignUp: undefined;
    SignIn: undefined;
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
                <RootStack.Screen name="Authentication" component={AuthenticationScreen} />
                <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <RootStack.Screen name="Loading" component={LoadingScreen} />
                <RootStack.Screen name="SignUp" component={SignUpScreen} />
                <RootStack.Screen name="SignIn" component={SignInScreen} />
                <RootStack.Screen name="Home" component={HomeScreen} />
                <RootStack.Screen name="Discover" component={DiscoverRidersScreen} />
                <RootStack.Screen name="Publish" component={PublishRiderTripScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;