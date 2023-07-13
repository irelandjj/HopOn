/* eslint-disable func-style */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';

const newOrderId = uuidv4();

const dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-1' })

const { tableName } = process.env

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing request body' }),
      };
    }

    const cognitoUserId = event.requestContext.authorizer?.claims?.sub;

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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      TableName: tableName!,
      Item: {
        'OrderID': newOrderId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        'RiderID': cognitoUserId!,
        'Origin': {
          'latitude': requestBody.pickupLocation.latitude,
          'longitude': requestBody.pickupLocation.longitude,
        },
        'Destination': {
          'latitude': requestBody.dropoffLocation.latitude,
          'longitude': requestBody.dropoffLocation.longitude,
        },
        'RideStatus': requestBody.rideStatus,
        'Distance': 10,
      }
    };

    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order added successfully' }),
    };
  } catch (error) {
    console.error('Error putting item:', JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error putting item' }),
    };
  }
};

async function getActiveRide(cognitoUserId: string): Promise<AWS.DynamoDB.ItemList | null> {
  const params = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    TableName: tableName!,
    IndexName: 'RiderID-index',
    KeyConditionExpression: 'RiderID = :riderId',
    ExpressionAttributeValues: {
      ':riderId': cognitoUserId,
      ':completed': 'COMPLETED'
    },
    FilterExpression: 'RideStatus <> :completed',
  };

  const result = await dynamoDb.query(params).promise();
  if (result.Count) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result.Items!;
  } else {
    return null;
  }
}
