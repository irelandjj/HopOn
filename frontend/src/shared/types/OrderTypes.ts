import { RideStatus } from "../enums/RideStatus";

export interface CreateOrderPayload {
    rideStatus: RideStatus;
    pickupLocation: {
        latitude: number;
        longitude: number;
    };
    dropoffLocation: {
        latitude: number;
        longitude: number;
    };
}

export interface UpdateOrderPayload {
    orderID: string;
    driverID?: string;
    pickupLocation?: {
        latitude: number;
        longitude: number;
    };
    dropoffLocation?: {
        latitude: number;
        longitude: number;
    };
    pickupTime?: string;
    dropoffTime?: string;
    status?: string;
    price?: number;
    distance?: number;
}

export interface ActiveOrderPayload {
    rideStatus: RideStatus;
}