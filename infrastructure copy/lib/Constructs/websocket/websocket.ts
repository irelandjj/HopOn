import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as apigatewayv2integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';
import { IamResource } from 'aws-cdk-lib/aws-appsync';
import * as cdk from 'aws-cdk-lib';

export interface WebSocketProps {
    name: string
    lambdaSg: ec2.SecurityGroup
}

export class WebSocket extends Construct {
  private props: WebSocketProps
  public api: apigateway.CfnApi
  private routes: apigateway.CfnRoute[] = []
  private role: iam.Role
  constructor(scope: Construct, id: string, props: WebSocketProps) {
    super(scope, id);
    this.props = props
    const srcroot = './lib/constructs/websocket/src'

    this.createApi()
    this.createRoute('$connect', `${srcroot}/connect.ts`)
    //this.createRoute('$disconnect', `${srcroot}/connect.ts`)
    //this.createRoute('$send', `${srcroot}/connect.ts`)
    this.createDeployment()

  }
  createApi() {
    this.api = new apigateway.CfnApi(this, 'api', {
      name: 'WSApi',
      protocolType: 'WEBSOCKET',
      routeSelectionExpression: '$request.body.action'
    })

    this.role = new iam.Role(this, 'role', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com')
    })

    this.role.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['lambda:InvokeFunction'] }))
  }
  createRoute(name: string, entry: string) {
    const routeLambda = new lambdanodejs.NodejsFunction(this, `${name}-lambda`, {
      runtime:lambda.Runtime.NODEJS_18_X,
      entry: entry
    })
    
    routeLambda.addPermission('invoke', {
      principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceAccount: cdk.Stack.of(this).account
    })
    const integration = new apigateway.CfnIntegration(this, `${name}-integration`, {
      apiId: this.api.attrApiId,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:${cdk.Aws.PARTITION}:apigateway:${cdk.Aws.REGION}:lambda:path/2015-03-31/functions/${routeLambda.functionArn}/invocations`,
    })
    this.routes.push( new apigateway.CfnRoute(this, `${name}-route`, {
      apiId: this.api.attrApiId,
      routeKey: name,
      target: `integrations/${integration.ref}`
    }))
  }
  createDeployment() {
    const deployment = new apigateway.CfnDeployment(this , 'deployment', {
      apiId: this.api.attrApiId
    })

    this.routes.forEach(route => {
      deployment.addDependency(route)
    })

    new apigateway.CfnStage(this, 'prod-stage', {
        apiId: this.api.attrApiId,
        stageName: 'production'
    })
  }}