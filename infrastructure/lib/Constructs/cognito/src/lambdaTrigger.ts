import * as AWS from 'aws-sdk';

const ddb = new AWS.DynamoDB();

const { tableName } = process.env

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
exports.handler = async (event: any, context: AWSLambda.Context) => {
  if (!event.request.userAttributes.sub) {
    console.log('Error: No user was written to DynamoDB');
    return;
  }

  const date = new Date();

  const params: AWS.DynamoDB.PutItemInput = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    TableName: tableName!,
    Item: {
      'UserID': { 'S': event.request.userAttributes.sub },
      'Name': { 'S': event.request.userAttributes.name },
      'Email': { 'S': event.userName },
      'CreatedAt': { 'S': date.toISOString() },
      'UpdatedAt': { 'S': date.toISOString() },
    }
  };

  try {
    await ddb.putItem(params).promise();
    console.log('Success adding user to DB')
  } catch (e) {
    console.log('Error adding user to DB: ', e)
  }
};
