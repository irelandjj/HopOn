import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, SafeAreaView, Button, Pressable } from "react-native";
import styles from "./styles";
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections, { MapViewDirectionsOrigin } from 'react-native-maps-directions';
import MapDirections from "../../components/MapDirections";
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import BackButton from "../../components/BackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import PressableButton from "../../components/PressableButton";
import { colors } from "../../../utils/globalStyles";

type PublishScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Publish'
>;

const PublishRiderTripScreen = () => {
    const [originPlace, setOriginPlace] = useState<any | null>(null)
    const [destinationPlace, setDestinationPlace] = useState<any | null>(null)
    const [isPublishButtonEnabled, setIsPublishButtonEnabled] = useState(false)
    const [location, setLocation] = useState<GeoPosition | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const GOOGLE_MAPS_API_KEY = 'AIzaSyAoCyYpY6I5af35BfirFnkdpHlDMuiB6SQ';

    const navigation = useNavigation<PublishScreenNavigationProp>();

    const origin = { latitude: 55.68443559999999, longitude: 12.5922418 };
    const destination = { latitude: 55.6843273, longitude: 12.5733129 };

    const goBack = () => {
        navigation.goBack();
    };

    const originRef = useRef<any>();
    const destinationRef = useRef<any>();

    useEffect(() => {

        console.log("originPlace: ", originPlace);
        console.log("destinationPlace: ", destinationPlace);
        if (originPlace && destinationPlace) {
            setIsPublishButtonEnabled(true)
        }
        else {
            setIsPublishButtonEnabled(false)
        }

    }, [originPlace, destinationPlace]);

    useEffect(() => {
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

    const onPublish = () => {
        console.log("publish ride");
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

                    <PressableButton text="Publish ride" onPress={() => onPublish()} disabled={!isPublishButtonEnabled} />

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