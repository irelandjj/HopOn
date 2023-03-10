import React from "react";
import { View, Text, FlatList } from "react-native";
import styles from "./styles";
// import ridersData from "../../../assets/data/riders";
import RiderPostedCard from "../../components/RiderPostedCard";

type RidersListProps = {
    ridersData: any
}

const RidersList = ({ ridersData }: RidersListProps) => (

    <FlatList
        style={styles.riderList}
        data={ridersData}
        renderItem={({ item }) => <RiderPostedCard cardInfo={item} />}
        keyExtractor={item => item.id}
    />


);

export default RidersList;