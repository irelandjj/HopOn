import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import * as ddb from 'aws-cdk-lib/aws-dynamodb'
import { restApi } from '../Constructs/restapi/restapi';
import * as cdk from 'aws-cdk-lib'

export class BackendStack extends Stack {
  private tablename: string
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createDynamodb('Orders')
    this.createApi()

  }
  createDynamodb(tableName: string) {
    const table = new ddb.Table(this, 'MyTable', {
      partitionKey: { name: 'OrderID', type: ddb.AttributeType.STRING },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      tableName: tableName,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    this.tablename = table.tableName
  }
  createApi() {
    new restApi(this, 'Api', {
      name: 'testApi',
      srcPath: './api-app',
      endpoints: [
        {
          endpoint: 'createOrderInDB',
          method: 'post'
        },
      ],
      tableName: this.tablename
    })
  }
  

}

  
  
  
  
  
  
