import React  from "react";
import styles from "../SignInScreen/styles";
import { View, Text, ActivityIndicator} from "react-native";

const LoadingScreen = () => {

    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
            <ActivityIndicator />
        </View>
    );
};

export default LoadingScreen;