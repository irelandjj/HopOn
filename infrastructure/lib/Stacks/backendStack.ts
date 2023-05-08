import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as CustomResources from 'aws-cdk-lib/custom-resources';
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as ddb from 'aws-cdk-lib/aws-dynamodb'
import { restApi } from '../Constructs/restapi/restapi';
import * as cdk from 'aws-cdk-lib'
import { BackendStackProps } from './schema/backendStack.schema';

export class BackendStack extends Stack {
  private props: BackendStackProps
  private userPool: cognito.UserPool
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);
    this.props = props
    this.createDynamodb('Users', 'UserID')
    this.createDynamodb('Orders', 'OrderID')
    this.createApi()
    this.cognitoLambdaTrigger()

  }
  createDynamodb(tableName: string, partitionKey: string) {
    new ddb.Table(this, `${tableName}-table`, {
      partitionKey: { name: partitionKey, type: ddb.AttributeType.STRING },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      tableName: tableName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
  createApi() {
    new restApi(this, 'Api', {
      name: 'testApi',
      srcPath: './api-app',
      endpoints: [
        {
          endpoint: 'createOrderInDB',
          method: 'post',
          envVars: {tableName: 'Orders'}
        },
      ],
      userPoolArn: this.userPool.userPoolArn
    })
  }
  cognitoLambdaTrigger() {
    const lambdaTrigger = new lambdanodejs.NodejsFunction(this, 'cognito-lambda-trigger', {
      runtime:lambda.Runtime.NODEJS_18_X,
      entry: './lib/Constructs/cognito/src/lambdaTrigger.ts',
      environment: {
        tableName: 'Users'
      }
    })
    lambdaTrigger.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:PutItem'],
      resources: ['arn:aws:dynamodb:region:account-id:table/Users'],
    }))
    this.userPool = cognito.UserPool.fromUserPoolId(this, 'MyUserPool', this.props.userPoolId) as cognito.UserPool

    new CustomResources.AwsCustomResource(this, 'UpdateUserPool', {
      resourceType: 'Custom::UpdateUserPool',
      onCreate: {
        region: this.region,
        service: 'CognitoIdentityServiceProvider',
        action: 'updateUserPool',
        parameters: {
          UserPoolId: this.userPool.userPoolId,
          LambdaConfig: {
            PostConfirmation: lambdaTrigger.functionArn
          },
          UserAttributeUpdateSettings: { 
            AttributesRequireVerificationBeforeUpdate: []
          },
        },
        physicalResourceId: CustomResources.PhysicalResourceId.of(this.userPool.userPoolId),
      },
      policy: CustomResources.AwsCustomResourcePolicy.fromSdkCalls({ resources: CustomResources.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

    const invokeCognitoTriggerPermission = {
      principal: new iam.ServicePrincipal('cognito-idp.amazonaws.com'),
      sourceArn: this.userPool.userPoolArn
    }
    lambdaTrigger.addPermission('InvokePreSignUpHandlerPermission', invokeCognitoTriggerPermission)
  }
}

  
  
  
  
  
  
