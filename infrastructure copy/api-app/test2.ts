

const AWS = require ('aws-sdk');
const ddb = new AWS.DynamoDB();
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

// eslint-disable-next-line func-style
export const handler = async(
  event: APIGatewayProxyEvent,
  _context: Context 
) => {

    if (!event.request.userAttributes.sub) {
	    console.log('Error: No user was written to DynamoDB');
        context.done(null, event);
        return;
    }

    const date = new Date();
    
    const params = {
        TableName: process.env.USERSTABLE,
        Item: {
            'UserID': { 'S': event.request.userAttributes.sub},
            'Name': { 'S': event.request.userAttributes.name},
            'Email': { 'S': event.userName},
            'CreatedAt': {'S': date.toISOString()},
            'UpdatedAt': {'S': date.toISOString()},
        }
    };

    try {
        await ddb.putItem(params).promise();
        console.log('Success adding user to DB')
    } catch (e){
        console.log('Error adding user to DB: ', e)
    }

    context.done(null, event)
    
};