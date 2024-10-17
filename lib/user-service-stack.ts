import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class UserServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const lamdaFunction = new lambda.Function(this, 'UserFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
    });

    const api = new apigateway.RestApi(this, "auth", {
      description: "Api for auth",
      deployOptions: {
        stageName: "dev",
        tracingEnabled: true
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowHeaders: ['Authorization', 'Content-Type'],
      }

    });

    const auth = api.root.addResource('auth');
    const register = api.root.addResource('register');

    register.addMethod("POST", new apigateway.LambdaIntegration(lamdaFunction, {
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: { "application/json": `{"statusCode":200}` }
    }));


    auth.addMethod("GET", new apigateway.LambdaIntegration(lamdaFunction, {
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: { "application/json": '{"statusCode": 200}' }
    }));


    auth.addMethod("POST", new apigateway.LambdaIntegration(lamdaFunction, {
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: { "application/json": '{"statusCode": 200}' }
    }));

    auth.addMethod("PUT", new apigateway.LambdaIntegration(lamdaFunction, {
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: { "application/json": '{"statusCode": 200}' }
    }));



    // example resource
    // const queue = new sqs.Queue(this, 'UserServiceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
