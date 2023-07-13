import { RideStatus } from "../enums/RideStatus";

export interface Location {
    latitude: number;
    longitude: number;
    name: string;
}

export interface CreateOrderPayload {
    rideStatus: RideStatus;
    pickupLocation: Location; 
    dropoffLocation: Location;
}

export interface UpdateOrderPayload {
    orderID: string;
    driverID?: string;
    pickupLocation?: Location;
    dropoffLocation?: Location;
    pickupTime?: string;
    dropoffTime?: string;
    status?: string;
    price?: number;
    distance?: number;
}

export interface ActiveOrderPayload {
    rideStatus: RideStatus;
}