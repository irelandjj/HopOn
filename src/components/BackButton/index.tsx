import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle, } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "./styles";

interface CustomControllerProps {
    style?: StyleProp<ViewStyle>;
    onPress: () => void;
}

const BackButton = (props: CustomControllerProps) => {
    const { style, onPress } = props;

    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <View style={styles.arrowColor} />
            <Icon color='white' name="ios-arrow-back-circle" size={60} style={styles.buttonFill} />
        </TouchableOpacity>
    );
};

export default BackButton;