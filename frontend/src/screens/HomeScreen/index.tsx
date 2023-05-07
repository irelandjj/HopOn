import React, { useEffect } from "react";
import { Button, Pressable, Text, View } from "react-native";
import styles from "./styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../navigation/RootNavigator";
import { AuthorizationService } from "../../services/AuthorizationService";
import { API } from "aws-amplify";

type HomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Home'
>;

const HomeScreen = () => {

    const navigation = useNavigation<HomeScreenNavigationProp>();

    const signOutUser = async () => {
        try {
            await AuthorizationService.signOut();
            console.log('User signed out successfully');
            navigation.navigate("SignIn");
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    const goToDiscoverRidersScreen = () => {
        navigation.navigate("Discover");
    };

    const goToPublishRiderTripScreen = () => {
        navigation.navigate("Publish");
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <Pressable style={styles.button} onPress={() => goToDiscoverRidersScreen()}>
                    <Text style={styles.textButton}>Driver</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => goToPublishRiderTripScreen()}>
                    <Text style={styles.textButton}>Rider</Text>
                </Pressable>
            </View>
            <Button title="Sign Out" onPress={signOutUser} />
        </View>

    );
};

export default HomeScreen;