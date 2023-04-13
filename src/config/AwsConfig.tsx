import { Amplify } from 'aws-amplify';

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
                    name: 'HopOnAPI',
                    endpoint: 'https://kfgb2616ne.execute-api.eu-north-1.amazonaws.com/test',
                }
            ]
        },
    });
}