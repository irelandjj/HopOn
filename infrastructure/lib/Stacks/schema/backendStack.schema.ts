import { StackProps } from 'aws-cdk-lib';


export interface BackendStackProps extends StackProps {
    userPoolId: string
}