import { API } from 'aws-amplify';
import { API_NAME } from "@env"

export async function callApi(method: string, path: string, data?: any, queryParams?: any) {
  const request = {
    body: method === 'POST' ? data : undefined,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    queryStringParameters: method === 'GET' ? queryParams : undefined
  };

  try {
    let response;
    switch (method) {
      case 'GET':
        response = await API.get(API_NAME, path, request);
        break;
      case 'POST':
        response = await API.post(API_NAME, path, request);
        break;
      // Other methods like PUT, DELETE, etc. can be added here
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    return response;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error(`Error calling ${method} ${path}:`, error.message, '-', error.response.data.message);
      throw error.response.data.message;
    } else {
      console.error(`Error calling ${method} ${path}:`, error);
      throw error;
    }
  }
}