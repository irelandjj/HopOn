import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'

type EndPoint = {
    endpoint: string,
    method:string
    envVars?: { [key: string]: string; }
}

interface restApiProps  {
name: string
srcPath: string
endpoints: EndPoint[]
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
      const environment = resource.envVars ? resource.envVars : {}
      const lambdafunc = new lambdanodejs.NodejsFunction(this, `${resource.endpoint}-lambda`, {
        runtime:lambda.Runtime.NODEJS_18_X,
        entry: `${this.props.srcPath}/${resource.endpoint}.ts`,
        environment: environment
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