import React from "react";
import { Button, Pressable, Text, View } from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../navigation/RootNavigator";

type HomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Home'
>;

const HomeScreen = () => {

    const navigation = useNavigation<HomeScreenNavigationProp>();

    const goToDiscoverRidersScreen = () => {
        navigation.navigate("Discover");
    };

    const goToPublishRiderTripScreen = () => {
        navigation.navigate("Publish");
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={() => goToDiscoverRidersScreen()}>
                <Text style={styles.textButton}>Driver</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => goToPublishRiderTripScreen()}>
                <Text style={styles.textButton}>Rider</Text>
            </Pressable>
        </View>);
};

export default HomeScreen;