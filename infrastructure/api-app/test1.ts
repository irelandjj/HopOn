import { APIGatewayProxyEvent, Context } from 'aws-lambda';

// eslint-disable-next-line func-style
export const handler = async(
  event: APIGatewayProxyEvent,
  _context: Context 
) => {
  console.log(event, _context)
  const data = 'Hello world'
  const success = {
    statusCode: 200,
    body: JSON.stringify({
      data
    })
  }
  return success
}