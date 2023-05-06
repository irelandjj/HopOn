import { API } from 'aws-amplify';
import { apiName } from '../config/AwsConfig';
import { CreateOrderPayload, UpdateOrderPayload } from '../shared/types/OrderTypes';
import { CREATE_ORDER_PATH, UPDATE_ORDER_PATH } from '../constants/apiPaths';

async function createOrderApi(path: string, data: CreateOrderPayload) {
    const request = {
        body: data,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    try {
        const response = await API.post(apiName, path, request);
        return response;
    } catch (error: any) {
        console.error(`Error calling POST ${path}:`, error.message, '->', error.response.data.message);
        throw error.response.data.message;
    }
}

async function updateOrderApi(path: string, data: UpdateOrderPayload) {
    const request = {
        body: data,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    try {
        const response = await API.put(apiName, path, request);
        return response;
    } catch (error) {
        console.error(`Error calling PUT ${path}:`, error);
        throw error;
    }
}

export const OrderService = {
    createOrder: async (orderData: CreateOrderPayload) => {
        return createOrderApi(CREATE_ORDER_PATH, orderData);
    },

    updateOrder: async (orderId: string, updatedData: UpdateOrderPayload) => {
        return updateOrderApi(`${UPDATE_ORDER_PATH}/${orderId}`, updatedData);
    }
};
