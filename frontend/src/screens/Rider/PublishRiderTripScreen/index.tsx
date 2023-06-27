import React, { useEffect, useState, useRef } from "react";
import { View, Alert, ActivityIndicator, SafeAreaView, Button, Pressable } from "react-native";
import styles from "./styles";
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections, { MapViewDirectionsOrigin } from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import BackButton from "../../../components/BackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import PressableButton from "../../../components/PressableButton";
import { colors } from "../../../utils/globalStyles";
import { OrderService } from "../../../services/OrderService";
import { CreateOrderPayload } from "../../../shared/types/OrderTypes";
import { RideStatus } from "../../../shared/enums/RideStatus";
import { GOOGLE_MAPS_API_KEY } from "@env"

type PublishScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Publish'
>;

const PublishRiderTripScreen = () => {
    const [originPlace, setOriginPlace] = useState<any | null>(null)
    const [destinationPlace, setDestinationPlace] = useState<any | null>(null)
    const [isPublishButtonEnabled, setIsPublishButtonEnabled] = useState(false)
    const [location, setLocation] = useState<GeoPosition | null>(null);
    const [isPublishingRide, setIsPublishingRide] = useState(false);
    const [hasUserPublishedRide, setHasUserPublishedRide] = useState(false);

    const navigation = useNavigation<PublishScreenNavigationProp>();

    const goBack = () => {
        navigation.goBack();
    };

    const originRef = useRef<any>();
    const destinationRef = useRef<any>();

    useEffect(() => {
        if (originPlace && destinationPlace) {
            setIsPublishButtonEnabled(true)
        }
        else {
            setIsPublishButtonEnabled(false)
        }

    }, [originPlace, destinationPlace]);

    useEffect(() => {
        const getActiveOrder = async () => {
            try {
                const response = await OrderService.getRiderActiveOrder();
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };

        getActiveOrder();

        Geolocation.getCurrentPosition(
            (position) => {
                setLocation(position);
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true }
        );
    }, []);

    const onPublishRide = async () => {
        try {
            const newOrderData: CreateOrderPayload = {
                rideStatus: RideStatus.Requested,
                pickupLocation: originPlace,
                dropoffLocation: destinationPlace,
            };

            setIsPublishingRide(true);
            await OrderService.createOrder(newOrderData);
            Alert.alert('Success', 'Your ride has been published successfully!');
        } catch {
            Alert.alert('Error', 'Error while publishing ride.');
        } finally {
            setIsPublishingRide(false);
        }
    }

    const onChangeOriginText = (text: string) => {
        let isFocused = originRef.current?.isFocused();
        if (text === "" || isFocused) {
            setOriginPlace(null)
        }
    }

    const onChangeDestinationText = (text: string) => {
        let isFocused = destinationRef.current?.isFocused();
        if (text === "" || isFocused) {
            setDestinationPlace(null)
        }
    }

    return (

        <SafeAreaView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <View style={styles.inputContainer} />
                    {location && <MapView initialRegion={{
                        latitude: location?.coords.latitude as number,
                        longitude: location?.coords.longitude as number,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                        showsMyLocationButton={true}
                        loadingEnabled={true}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        style={styles.map}>


                        {originPlace && destinationPlace && <MapViewDirections
                            origin={originPlace}
                            destination={destinationPlace}
                            apikey={GOOGLE_MAPS_API_KEY}
                            strokeWidth={3}
                            strokeColor={colors.foreground}
                        />}
                        {originPlace && <Marker title={'Pickup Point'} coordinate={originPlace} />}
                        {destinationPlace && <Marker title={'Destination'} coordinate={destinationPlace} />}
                    </MapView>}
                    <GooglePlacesAutocomplete
                        ref={originRef}
                        placeholder='Where from?'
                        textInputProps={{
                            placeholderTextColor: colors.secondaryText,
                            returnKeyType: "search",
                            onChangeText: onChangeOriginText
                        }}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            setOriginPlace({ latitude: details?.geometry.location.lat, longitude: details?.geometry.location.lng })
                        }}
                        onNotFound={() => {
                            setOriginPlace(null)
                        }}

                        enablePoweredByContainer={false}

                        styles={{
                            textInput: styles.textInput,
                            container: {
                                position: 'absolute',
                                top: 5,
                                left: 10,
                                right: 10,
                            },
                            listView: {
                                position: 'absolute',
                                top: 125,
                            },
                            description: { color: colors.primaryText },
                            row: { marginBottom: 2 }
                        }}
                        query={{
                            key: GOOGLE_MAPS_API_KEY,
                            language: 'en',
                        }}
                    />
                    <GooglePlacesAutocomplete
                        ref={destinationRef}
                        placeholder='Where to?'
                        textInputProps={{
                            placeholderTextColor: colors.secondaryText,
                            returnKeyType: "search",
                            onChangeText: onChangeDestinationText
                        }}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            setDestinationPlace({ latitude: details?.geometry.location.lat, longitude: details?.geometry.location.lng })
                        }}
                        onNotFound={() => {
                            setDestinationPlace(null)
                        }}
                        enablePoweredByContainer={false}
                        styles={{
                            textInput: styles.textInput,
                            container: {
                                position: 'absolute',
                                top: 60,
                                left: 10,
                                right: 10,
                            },
                            listView: {
                                position: 'relative',
                                top: 10,
                            },
                            description: { color: colors.primaryText },
                            row: { marginBottom: 2 }
                        }}
                        query={{
                            key: GOOGLE_MAPS_API_KEY,
                            language: 'en',
                        }}
                    />

                    {isPublishingRide ?
                        <ActivityIndicator style={styles.activityIndicator} size="large" color={colors.foreground} />
                        : <PressableButton text="Publish ride" onPress={() => onPublishRide()} disabled={!isPublishButtonEnabled} />
                    }

                    <View style={styles.originIcon} />
                    <View style={styles.line} />
                    <Icon name="flag" style={styles.destinationIcon} />
                    <BackButton style={styles.backIcon} onPress={goBack} />

                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default PublishRiderTripScreen;