import { API } from 'aws-amplify';
import { OrderService } from '../../src/services/OrderService';
import { CreateOrderPayload, UpdateOrderPayload } from '../../src/shared/types/OrderTypes';
import { apiName } from '../../src/config/AwsConfig';
import { CREATE_ORDER_PATH, UPDATE_ORDER_PATH } from '../../src/constants/apiPaths';

jest.mock('aws-amplify', () => ({
    API: {
        post: jest.fn(),
        put: jest.fn(),
    },
}));

describe('OrderService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create an order', async () => {
        const mockOrderData: CreateOrderPayload = {
            pickupLocation: {
                latitude: 123.123,
                longitude: 123.123,
            },
            dropoffLocation: {
                latitude: 123.123,
                longitude: 123.123,
            }
        };

        const expectedResult = {
            status: "success",
            message: "Order created successfully",
        };

        (API.post as jest.Mock).mockResolvedValue(expectedResult);

        const result = await OrderService.createOrder(mockOrderData);

        expect(API.post).toHaveBeenCalledWith(apiName, CREATE_ORDER_PATH, expect.anything());
        expect(result).toEqual(expectedResult);
    });

    it('should update an order', async () => {
        const orderId = 'test-order-id';
        const mockUpdateData: UpdateOrderPayload = {
            orderID: orderId,
        };

        const expectedResult = {
            status: "success",
            message: "Order updated successfully",
        };

        (API.put as jest.Mock).mockResolvedValue(expectedResult);

        const result = await OrderService.updateOrder(orderId, mockUpdateData);

        expect(API.put).toHaveBeenCalledWith(apiName, `${UPDATE_ORDER_PATH}/${orderId}`, expect.anything());
        expect(result).toEqual(expectedResult);
    });
});
