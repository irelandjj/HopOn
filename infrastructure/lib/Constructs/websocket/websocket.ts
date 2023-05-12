
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';


export class WebSocket extends Construct {
  public api: apigateway.CfnApi
  private routes: apigateway.CfnRoute[] = []
  private role: iam.Role
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const srcroot = './lib/constructs/websocket/src'

    this.createApi()
    this.createRoute('$connect', `${srcroot}/connect.ts`)
    //this.createRoute('$disconnect', `${srcroot}/connect.ts`)
    //this.createRoute('$send', `${srcroot}/connect.ts`)
    this.createDeployment()

  }
  createApi() {
    this.role = new iam.Role(this, 'role', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com')
    })
    this.role.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['*'] }))

    this.api = new apigateway.CfnApi(this, 'api', {
      name: 'WSApi',
      protocolType: 'WEBSOCKET',
      routeSelectionExpression: '$request.body.action',
      apiKeySelectionExpression: '$request.header.x-api-key',
    })

  }
  createRoute(name: string, entry: string) {
    const routeLambda = new lambdanodejs.NodejsFunction(this, `${name}-lambda`, {
      runtime:lambda.Runtime.NODEJS_18_X,
      entry: entry
    })
    
    routeLambda.addPermission(`${name}-invoke`, {
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
      authorizationType: 'NONE',
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
      stageName: 'prod',
    })
  }}