import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class UserServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const eventProccessingQueue = sqs.Queue.fromQueueArn(this, 'EventProccessingQueue', 'arn:aws:sqs:ap-south-1:180294203498:event-processing-que');


    const lamdaFunction = new lambda.Function(this, 'UserFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
    });

    eventProccessingQueue.grantSendMessages(lamdaFunction);
    lamdaFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [eventProccessingQueue.queueArn],
    }));

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
    const verify = api.root.addResource('email-verify');
    const forgetPassword = api.root.addResource('forget-password');
    const resetPassword = api.root.addResource('reset-password');
    const loginUser = api.root.addResource('login');




    verify.addMethod("POST", new apigateway.LambdaIntegration(lamdaFunction, {
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: { "application/json": `{"statusCode":200}` }
    }));

    verify.addMethod("GET", new apigateway.LambdaIntegration(lamdaFunction, {
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: { "application/json": `{"statusCode":200}` }
    }));

    forgetPassword.addMethod("POST", new apigateway.LambdaIntegration(lamdaFunction, {
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: { "application/json": `{"statusCode":200}` }
    }));

    resetPassword.addMethod("POST", new apigateway.LambdaIntegration(lamdaFunction, {
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: { "application/json": `{"statusCode":200}` }
    }));

    register.addMethod("POST", new apigateway.LambdaIntegration(lamdaFunction, {
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: { "application/json": `{"statusCode":200}` }
    }));




    loginUser.addMethod("POST", new apigateway.LambdaIntegration(lamdaFunction, {
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: { "application/json": '{"statusCode": 200}' }
    }));

    auth.addMethod("GET", new apigateway.LambdaIntegration(lamdaFunction, {
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
