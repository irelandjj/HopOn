import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { restApi } from '../Constructs/restapi/restapi';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new restApi(this, 'Api', {
      name: 'testApi',
      srcPath: './api-app',
      endpoints: [
        {
          endpoint: 'test1',
          method: 'get'
        },
        {
          endpoint: 'test2',
          method: 'get'
        },
      ]
    })
  }
  

}

  
  
  
  
  
  
