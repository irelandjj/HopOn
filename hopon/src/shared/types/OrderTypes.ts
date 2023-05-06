export interface CreateOrderPayload {
    rideStatus: string;
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