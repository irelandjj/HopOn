/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult, Context } from 'aws-lambda';
import { CognitoJwtVerifier} from 'aws-jwt-verify'
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  tokenUse: 'access'
})

export const handler = async (event: APIGatewayAuthorizerEvent, _context: Context) => {
  const token = getToken(event)
  const verifyResult = await verifyToken(token)
  return getPolicyDocument(verifyResult.effect, event.methodArn, verifyResult.payload!.username || 'INVALID_USER')
}

const getToken = (event: APIGatewayAuthorizerEvent) => {
  if (!event.type || event.type !=='REQUEST') {
    console.log('Expected "event.headers.Authorization" parameter to be set')
    return 'NOT VALID TOKEN'
  }
  //should be the access token
  const tokenString  = event.queryStringParameters!.Authorization
  if (!tokenString) {
    console.log('Expected "eventheaders.Authorization" parameter to be set')
    return 'NOT VALID TOKEN'
  }
  const match = tokenString.match(/^Bearer (.*)$/)
  if (!match || match.length < 2) {
    console.log(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`)
    return 'NOT VALID TOKEN'
  }
  return match[1]
}

const verifyToken = async (token: string): Promise<{effect: string, payload?: CognitoAccessTokenPayload}> => {
  try {
    const payload = await verifier.verify(token, {
      clientId: process.env.CLIENT_ID!
    })
    return {effect: 'Allow', payload}
  } catch {
    return { effect: 'Deny'}
  }
}

const getPolicyDocument = (effect: string, resource: string, principalId: string): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        }]
    }                        
  }}