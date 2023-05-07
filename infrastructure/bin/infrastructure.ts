#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/Stacks/backendStack';

const app = new cdk.App();
new BackendStack(app, 'backendStack', { env: {account: cdk.Aws.ACCOUNT_ID, region: cdk.Aws.REGION }, description: 'This is the HopOn backend stack' });
