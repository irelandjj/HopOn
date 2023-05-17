import * as AWS from 'aws-sdk';

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-1' })

const { tableName } = process.env

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
exports.handler = async (event: any, context: AWSLambda.Context) => {
  if (!event.request.userAttributes.sub) {
    const errorMessage = 'Error: No Cognito User ID (sub) provided in the request.';
    console.log(errorMessage);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: errorMessage }),
    };
  }

  const date = new Date();

  const params = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    TableName: tableName!,
    Item: {
      'UserID': event.request.userAttributes.sub,
      'Name': event.request.userAttributes.name,
      'Email': event.request.userAttributes.email,
      'CreatedAt': date.toISOString(),
      'UpdatedAt': date.toISOString(),
    }
  };

  try {
    await ddb.put(params).promise();
    console.log('Success adding user to DB');
  } catch (e) {
    console.error('Error adding user to DB: ', e);
    let errorMessage = 'Error adding user to DB';
    if (e instanceof Error) {
      errorMessage = `Error adding user to DB: ${e.message}`;
    }
    throw new Error(errorMessage);
  }

  return event;
};
