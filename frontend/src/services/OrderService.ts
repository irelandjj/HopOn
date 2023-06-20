import { callApi } from './ApiService';
import { API_PATH_ORDERS } from "@env"
import { CreateOrderPayload, UpdateOrderPayload } from '../shared/types/OrderTypes';
import { RideStatus } from '../shared/enums/RideStatus';

export const OrderService = {
    createOrder: async (orderData: CreateOrderPayload) => {
        const path = `/${API_PATH_ORDERS}`;
        return callApi('POST', path, orderData);
    },

    // getRiderActiveOrder: async (riderId) => {
    //     const path = `/${API_PATH_ORDERS}?status=active&riderId=${riderId}`;
    //     return callApi('GET', path);
    // },

    getAllOrders: async () => {
        const path = `/${API_PATH_ORDERS}`;
        return callApi('GET', path);
    },

    getAllActiveOrders: async () => {

        const activeStatuses = [
            RideStatus.Requested,
            RideStatus.Accepted,
            RideStatus.Arrived,
            RideStatus.InProgress
        ].join(',');

        const path = `/${API_PATH_ORDERS}?rideStatus=${activeStatuses}`;
        return callApi('GET', path);
    }
}
