import { Amplify } from 'aws-amplify';

export const AwsConfig = () => {

    Amplify.configure({
        Auth: {
            region: 'eu-north-1',
            userPoolId: 'eu-north-1_PgVfj0qFh',
            userPoolWebClientId: '37rob8ag1pohnrvnil5nbkvkch',
            mandatorySignIn: true
        }
    });

}