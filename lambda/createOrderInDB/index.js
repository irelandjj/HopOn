const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();
const { v4: uuidv4 } = require('uuid');

const newOrderId = uuidv4();

exports.handler = async (event) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing request body' }),
            };
        }

        const cognitoUserId = event.requestContext.authorizer.claims.sub;

        // Check if the user already has an active ride
        const activeRide = await getActiveRide(cognitoUserId);

        if (activeRide) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'The current user already has an active ride.',
                    ride: activeRide
                })
            };
        }

        const requestBody = JSON.parse(event.body);

        // Check if the request body has the required properties
        const hasValidProperties =
            cognitoUserId &&
            requestBody.pickupLocation &&
            requestBody.dropoffLocation &&
            requestBody.rideStatus;

        if (!hasValidProperties) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message:
                        'Missing required parameters: Cognito user ID, pickupLocation, dropoffLocation, and rideStatus',
                }),
            };
        }

        const params = {
            TableName: process.env.ORDERSTABLE,
            Item: {
                'OrderID': { 'S': newOrderId },
                'RiderID': { 'S': cognitoUserId },
                'Origin': {
                    'M': {
                        'latitude': { 'N': requestBody.pickupLocation.latitude.toString() },
                        'longitude': { 'N': requestBody.pickupLocation.longitude.toString() },
                    },
                },
                'Destination': {
                    'M': {
                        'latitude': { 'N': requestBody.dropoffLocation.latitude.toString() },
                        'longitude': { 'N': requestBody.dropoffLocation.longitude.toString() },
                    },
                },
                'RideStatus': { 'S': requestBody.rideStatus },
                'Distance': { 'N': '10' },
            }
        };

        await ddb.putItem(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Order added successfully' }),
        };
    } catch (error) {
        console.error('Error putting item:', JSON.stringify(error, null, 2));

    }
};

async function getActiveRide(cognitoUserId) {
    const params = {
        TableName: process.env.ORDERSTABLE,
        IndexName: 'RiderID-index',
        KeyConditionExpression: 'RiderID = :riderId',
        ExpressionAttributeValues: {
            ':riderId': { 'S': cognitoUserId },
            ':completed': { 'S': 'COMPLETED' }
        },
        FilterExpression: 'RideStatus <> :completed',
        Limit: 1 // Only get one active ride for the user
    };

    const result = await ddb.query(params).promise();
    if (result.Count > 0) {
        return result.Items[0];
    } else {
        return null;
    }
}
