import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { Endpoint } from 'aws-cdk-lib/aws-rds';

type EndPoint = {
    endpoint: string,
    method:string
}

interface restApiProps  {
name: string
srcPath: string
endpoints: EndPoint[]
tableName: string
}


export class restApi extends Construct {
  public props: restApiProps
  public api : apigateway.RestApi
  constructor(scope: Construct, id: string, props: restApiProps ) {
    super(scope, id)

    this.props = props
    this.createApi()
    this.createEndpoints()
    //this.createAuthorizer()
  }
  createEndpoints() {
    this.props.endpoints.forEach((resource) => {
      const lambdafunc = new lambdanodejs.NodejsFunction(this, `${resource.endpoint}-lambda`, {
        runtime:lambda.Runtime.NODEJS_18_X,
        entry: `${this.props.srcPath}/${resource.endpoint}.ts`,
        environment: {
          tableName: this.props.tableName
        }
      })
      const lambdaIntegration = new apigateway.LambdaIntegration(lambdafunc)
      const ressource = this.api.root.addResource(resource.endpoint)
      ressource.addMethod(resource.method, lambdaIntegration)
    })
  }
  // createAuthorizer() {
        
  // }
  createApi() {
    this.api = new apigateway.RestApi(this, 'API', {
      restApiName: `${this.props.name}-api`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS},
      deploy: true
    })
  }
}