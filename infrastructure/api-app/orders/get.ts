import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-1' })
const { tableName } = process.env

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { httpMethod, queryStringParameters } = event;

    enum RideStatus {
        Requested = "REQUESTED",
        Accepted = "ACCEPTED",
        Arrived = "ARRIVED",
        InProgress = "IN_PROGRESS",
        Completed = "COMPLETED",
        Cancelled = "CANCELLED",
    }

    if (httpMethod === 'GET') {
        // Get the active order for the rider
        if (queryStringParameters && queryStringParameters.riderId && queryStringParameters?.rideStatus === 'active') {

            const riderId = queryStringParameters.riderId;

            if (riderId !== event.requestContext.authorizer?.claims?.sub) {
                return {
                    statusCode: 403,
                    body: JSON.stringify({ message: 'You are not authorized to access this resource' }),
                };
            }

            const params = {
                TableName: tableName!,
                IndexName: 'RiderID-index',
                KeyConditionExpression: 'RiderID = :riderID',
                FilterExpression: 'RideStatus = :status1 OR RideStatus = :status2 OR RideStatus = :status3 OR RideStatus = :status4',
                ExpressionAttributeValues: {
                    ':riderID': riderId,
                    ':status1': RideStatus.Requested,
                    ':status2': RideStatus.Accepted,
                    ':status3': RideStatus.Arrived,
                    ':status4': RideStatus.InProgress
                },
            };

            console.log('Query parameters:', params); // Log the parameters

            try {
                const result = await dynamoDb.query(params).promise();
                console.log('Query result:', result); // Log the result. Consider using cloudwatch alarms to monitor whether there are more than one active orders per rider.
                const firstItem = result && result.Items && result.Items.length > 0 ? result.Items[0] : null;
                return {
                    statusCode: 200,
                    body: JSON.stringify(firstItem),
                };
            } catch (error) {
                console.error(error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Error fetching the orders for the rider' }),
                };
            }
        // Get all active orders
        } else if (queryStringParameters && queryStringParameters?.rideStatus === 'active') {

            const params = {
                TableName: tableName!,
                FilterExpression: "contains (rideStatus, :status1) OR contains (rideStatus, :status2) OR contains (rideStatus, :status3) OR contains (rideStatus, :status4)",
                ExpressionAttributeValues: {
                    ":status1": RideStatus.Requested,
                    ":status2": RideStatus.Accepted,
                    ":status3": RideStatus.Arrived,
                    ":status4": RideStatus.InProgress
                }
            };

            try {
                const result = await dynamoDb.scan(params).promise();
                return {
                    statusCode: 200,
                    body: JSON.stringify(result.Items),
                };
            } catch (error) {
                console.error(error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Error fetching all active orders' }),
                };
            }
        }
    }

    return { statusCode: 400, body: JSON.stringify({ message: 'Invalid request' }) };

}