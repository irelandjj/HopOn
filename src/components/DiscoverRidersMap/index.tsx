import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import styles from "./styles";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

type RidersData = {
    id: number,
    riderLatitude: number,
    riderLongitude: number,
    riderImage: string,
};

type RidersDataProps = {
    ridersData: RidersData[]
};

const DiscoverRidersMap = ({ ridersData }: RidersDataProps) => {

    const [location, setLocation] = useState<GeoPosition | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    return (
        <View>
            {location && <MapView region={{
                latitude: location?.coords.latitude as number,
                longitude: location?.coords.longitude as number,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                style={styles.map}
            >
                {ridersData.map((rider) => (
                    <Marker
                        key={rider.id}
                        coordinate={{ latitude: rider.riderLatitude, longitude: rider.riderLongitude }}
                    >
                        <Image style={{ width: 50, height: 50 }} source={{ uri: rider.riderImage }} />
                    </Marker>
                ))}
            </MapView>}
        </View >

    );

};

export default DiscoverRidersMap;