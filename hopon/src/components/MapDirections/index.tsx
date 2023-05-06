import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections, { MapViewDirectionsOrigin } from 'react-native-maps-directions';

type DirectionsProps = {
    originPlace: LatLng;
    destinationPlace: LatLng;
    apiKey: string;
};

const MapDirections = (props: DirectionsProps) => {
    return (
        <View>
            <MapViewDirections
                origin={props.originPlace}
                destination={props.destinationPlace}
                apikey={props.apiKey}
                strokeWidth={10}
                strokeColor="black"
            />
            {/* <Marker title={'Pickup Point'} coordinate={props.originPlace}/>
            <Marker title={'Destination'} coordinate={props.destinationPlace}/> */}
        </View>
    )
}

export default MapDirections;
