import { Amplify, Auth } from 'aws-amplify';

export const apiName = 'HopOnAPI';

export const AwsConfig = () => {

    Amplify.configure({
        Auth: {
            userPoolId: 'eu-north-1_PgVfj0qFh',
            userPoolWebClientId: '37rob8ag1pohnrvnil5nbkvkch',
            mandatorySignIn: true,
        },
        API: {
            endpoints: [
                {
                    name: apiName,
                    endpoint: 'https://kfgb2616ne.execute-api.eu-north-1.amazonaws.com/test',
                    custom_header: async () => {
                        return { Authorization: `${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
                    }
                }
            ]
        },
    });
}