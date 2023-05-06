import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./styles";
import Icon from 'react-native-vector-icons/Ionicons';

type CardInfo = {
    originAddress: string,
    destinationAddress: string,
    riderName: string,
    tripCost: number,
    riderImage: string,
};

type CardProps = {
    cardInfo: CardInfo
};

const RiderPostedCard = ({ cardInfo }: CardProps) => (

    <View style={styles.container}>
        <View style={styles.directions}>
            <Text style={styles.address}>{cardInfo.originAddress}</Text>
            <Text style={styles.address}>{cardInfo.destinationAddress}</Text>
        </View>
        <View style={styles.riderAndTripInfo}>
            <View style={styles.riderInfo}>
                <Image style={{ width: 50, height: 50}} source={{ uri: cardInfo.riderImage }} />
                <Text style={styles.riderName}>{cardInfo.riderName}</Text>
            </View>
            <View style={styles.tripInfo}>
                <Text style={styles.tripCost}>{cardInfo.tripCost}$</Text>
            </View>
        </View>
    </View>
);

export default RiderPostedCard;