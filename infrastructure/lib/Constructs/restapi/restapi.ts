import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as iam from 'aws-cdk-lib/aws-iam'

type EndPoint = {
  endpoint: string,
  method: string
  envVars?: { [key: string]: string; }
  managedPolicy: string
}

interface restApiProps {
  name: string
  srcPath: string
  endpoints: EndPoint[]
  userPoolArn: string
}

export class restApi extends Construct {
  public props: restApiProps
  public api: apigateway.RestApi
  private Authorizer: apigateway.CfnAuthorizer
  constructor(scope: Construct, id: string, props: restApiProps) {
    super(scope, id)

    this.props = props
    this.createApi()
    this.createEndpoints()
  }

  createEndpoints() {
    const resources: { [key: string]: apigateway.Resource } = {};

    // Iterates through each endpoint configuration provided
    this.props.endpoints.forEach((resource: EndPoint) => {
      const environment = resource.envVars ? resource.envVars : {};
      // Lambda function is created based on the endpoint and method
      const lambdafunc = new lambdanodejs.NodejsFunction(this, `${resource.endpoint}-${resource.method}-lambda`, {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${this.props.srcPath}/${resource.endpoint}/${resource.method.toLowerCase()}.ts`,
        environment: environment
      });
      lambdafunc.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(resource.managedPolicy));
      const lambdaIntegration = new apigateway.LambdaIntegration(lambdafunc);

      // Check if the resource already exists
      let apiResource: apigateway.Resource;
      if (resources[resource.endpoint]) {
        // Reuse the existing resource
        apiResource = resources[resource.endpoint];
      } else {
        // Create a new resource and store it in the resources object
        apiResource = this.api.root.addResource(resource.endpoint);
        resources[resource.endpoint] = apiResource;
      }

      // Add the method to the resource
      apiResource.addMethod(resource.method, lambdaIntegration, {
        authorizationType: apigateway.AuthorizationType.COGNITO,
        authorizer: { authorizerId: this.Authorizer.ref }
      });
    });
  }

  createApi() {
    this.api = new apigateway.RestApi(this, 'API', {
      restApiName: `${this.props.name}-api`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS
      },
      deploy: true,
    })
    const apiRole = new iam.Role(this, 'apiRole', {
      roleName: 'apiRole',
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    apiRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      effect: iam.Effect.ALLOW,
      actions: [
        'cognito-idp:DescribeUserPool',
        'cognito-idp:DescribeUserPoolClient',
        'cognito-idp:ListUsers'
      ]
    }));
    this.Authorizer = new apigateway.CfnAuthorizer(this, 'MyCognitoAuthorizer', {
      restApiId: this.api.restApiId,
      name: 'Authorizer',
      type: apigateway.AuthorizationType.COGNITO,
      identitySource: 'method.request.header.Authorization',
      providerArns: [this.props.userPoolArn],
    });
  }

}