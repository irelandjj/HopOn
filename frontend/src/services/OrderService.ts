import { API } from 'aws-amplify';
import { API_NAME, API_PATH_ORDERS } from "@env"
import { CreateOrderPayload, UpdateOrderPayload } from '../shared/types/OrderTypes';

async function createOrderApi(path: string, data: CreateOrderPayload) {
    const request = {
        body: data,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    try {
        const response = await API.post(API_NAME, path, request);
        return response;
    } catch (error: any) {
        if (error.response && error.response.data) {
            console.error(`Error calling POST ${path}:`, error.message, '->', error.response.data.message);
            throw error.response.data.message;
        } else {
            console.error(`Error calling POST ${path}:`, error);
            throw error;
        }
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
        const response = await API.put(API_NAME, path, request);
        return response;
    } catch (error) {
        console.error(`Error calling PUT ${path}:`, error);
        throw error;
    }
}

export const OrderService = {
    createOrder: async (orderData: CreateOrderPayload) => {
        return createOrderApi(`/${API_PATH_ORDERS}`, orderData);
    },

    updateOrder: async (orderId: string, updatedData: UpdateOrderPayload) => {
        return updateOrderApi(`/${API_PATH_ORDERS}/${orderId}`, updatedData);
    }
};
