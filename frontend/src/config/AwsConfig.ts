import { Amplify, Auth } from 'aws-amplify';
import {API_NAME, USER_POOL_ID, USER_POOL_WEB_CLIENT_ID, API_ENDPOINT} from "@env"

export const AwsConfig = () => {
    Amplify.configure({
        Auth: {
            userPoolId: USER_POOL_ID,
            userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,
            mandatorySignIn: true,
        },
        API: {
            endpoints: [
                {
                    name: API_NAME,
                    endpoint: API_ENDPOINT,
                    custom_header: async () => {
                        return { Authorization: `${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
                    }
                }
            ]
        },
    });
}