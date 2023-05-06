#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/Stacks/backendStack';

const envEU  = { account: '824306784079', region: 'us-east-1' };

const app = new cdk.App();
new BackendStack(app, 'backendStack', { env: envEU, description: 'This is the HopOn backend stack' });
