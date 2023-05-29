#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/Stacks/backendStack';
import * as dotenv from 'dotenv';
dotenv.config();


const app = new cdk.App();
new BackendStack(app, 'backendStack',  {env: {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_ACCOUNT_ID,
},
description: 'This is the HopOn backend stack',
userPoolId: process.env.CDK_USER_POOL_ID!,
clientId: process.env.CDK_CLIENT_ID!});
