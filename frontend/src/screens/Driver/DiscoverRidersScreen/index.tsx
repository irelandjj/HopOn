import React, { useEffect } from "react";
import { View, FlatList, SafeAreaView, Button } from "react-native";
import RiderPostedCard from "../../../components/RiderPostedCard";
import ridersData from "../../../../assets/data/riders";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import RidersList from "../../../components/RidersList";
import DiscoverRidersMap from "../../../components/DiscoverRidersMap";
import BackButton from "../../../components/BackButton";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../../navigation/RootNavigator";
import { OrderService } from "../../../services/OrderService";

type DiscoverScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Discover'
>;

const DiscoverRidersScreen = () => {

    const navigation = useNavigation<DiscoverScreenNavigationProp>();

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView>
            <View>
                <BackButton style={styles.backIcon} onPress={goBack}/>
                <DiscoverRidersMap ridersData={ridersData} />
                <RidersList ridersData={ridersData} />
            </View>
        </SafeAreaView>
    );
};


export default DiscoverRidersScreen;