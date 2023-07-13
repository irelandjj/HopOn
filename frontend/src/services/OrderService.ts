import { callApi } from './ApiService';
import { API_PATH_ORDERS } from "@env"
import { CreateOrderPayload } from '../shared/types/OrderTypes';
import { AuthorizationService } from './AuthorizationService';

export const OrderService = {
    createOrder: async (orderData: CreateOrderPayload): Promise<any> => {
        const path = `/${API_PATH_ORDERS}`;
        return callApi('POST', path, orderData);
    },

    getRiderActiveOrder: async (): Promise<any> => {

        const path = `/${API_PATH_ORDERS}`;
        const queryParams = {
            rideStatus: 'active',
            riderId: await AuthorizationService.getCurrentUserId()
        }
        return callApi('GET', path, undefined, queryParams);
    },

    getAllActiveOrders: async (): Promise<any> => {

        const path = `/${API_PATH_ORDERS}`;
        const params = {
            rideStatus: 'active',
        }
        return callApi('GET', path, params);
    },
};
