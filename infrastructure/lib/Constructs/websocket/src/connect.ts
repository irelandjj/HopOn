import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import * as aws from 'aws-sdk'

const dynamoDBClient = new aws.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' , region: process.env.AWS_REGION});

// eslint-disable-next-line func-style
export const handler = async(
  event: APIGatewayProxyEvent,
  _context: Context 
) => {
  const params = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    TableName: process.env.tableConnections!,
    Item: {
      'ConnectionID': event.requestContext.connectionId
    }
  }
  await dynamoDBClient.put(params).promise()
  console.log(event, _context)
  const success = {
    statusCode: 200
  }
  return success
}