import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as events from 'aws-cdk-lib/aws-events';
import { aws_events_targets as targets } from "aws-cdk-lib";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from "path";


export class ServeWorkflowConstruct extends Construct {
    constructor(
            scope: Construct, id: string,
            centralEventBusArn: string,
            slackWebhookUrl: cdk.aws_secretsmanager.ISecret,
        ) {

    super(scope, id);

    // Lambda functions setup
    const webhookFunction = new NodejsFunction(this, 'WebhookFunction', {
      handler: 'index.handler',
      entry: path.join(__dirname, '../../../business-logic/webHook.ts'),
      environment: {
        SECRET_ARN: slackWebhookUrl.secretArn,
      },
      bundling: {
          forceDockerBundling: false,
      },
    });
    slackWebhookUrl.grantRead(webhookFunction);

    const approvalFunction = new NodejsFunction(this, 'ApprovalFunction', {
      handler: 'index.handler',
      entry: path.join(__dirname, '../../../business-logic/approval.ts'),
      bundling: {
          forceDockerBundling: false,
      },
    });
    const stepFunctionsPolicy = new iam.PolicyStatement({
      actions: ['states:SendTaskSuccess', 'states:SendTaskFailure'],
      resources: ['*'],
    });
    approvalFunction.addToRolePolicy(stepFunctionsPolicy);

    const publishEventFunction = new NodejsFunction(this, 'PublishEventFunction', {
      handler: 'index.handler',
      entry: path.join(__dirname, '../../../business-logic/publishEvent.ts'),
      bundling: {
          forceDockerBundling: false,
      },
    });
    const eventBridgePolicy = new iam.PolicyStatement({
      actions: ['events:PutEvents'],
      resources: ['*'],
    });
    publishEventFunction.addToRolePolicy(eventBridgePolicy);

    // Gateway for slack
    const logGroup = new logs.LogGroup(
      this, 'SlackCalbackApiGatewayLogGroup',
      {
        logGroupName: `/aws/apigateway/callback-api-access-log`,
        retention: 1,
        removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE
      },
    );
    const api = new apigateway.RestApi(this, 'ApprovalApi', {
      restApiName: 'Approval Service',
      deployOptions: {
        dataTraceEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.clf()
      }
    });

    const slackResource = api.root.addResource('slack');
    slackResource.addMethod('POST', new apigateway.LambdaIntegration(approvalFunction));
    slackResource.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS
    });

    // Step Functions tasks
    const callWebhookTask = new tasks.LambdaInvoke(this, 'CallWebhookTask', {
      lambdaFunction: webhookFunction,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      payload: sfn.TaskInput.fromObject({
          'taskToken': sfn.JsonPath.taskToken,
          'input.$': '$'
      }),
      resultPath: '$.result',
    });

    const publishEventTask = new tasks.LambdaInvoke(this, 'PublishEventTask', {
      lambdaFunction: publishEventFunction,
      inputPath: '$',
    });

    // State machine definition
    const definition = callWebhookTask
      .next(new sfn.Choice(this, 'ApprovalCheck')
          .when(sfn.Condition.stringEquals('$.result.status', 'approved'), publishEventTask)
          .otherwise(new sfn.Fail(this, 'NotApproved', {
              cause: 'The request was not approved',
          })));

    const sfnLogGroup = new logs.LogGroup(this, 'stpLogGroup');
    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
      timeout: cdk.Duration.minutes(30),
      logs: {
        destination: sfnLogGroup,
        level: sfn.LogLevel.ALL,
      }
    });

    // catch paid event
    const centralBus = events.EventBus.fromEventBusArn(
      this, 'centralEventBusOfserve', centralEventBusArn
    );

    new events.Rule(this, 'PaymentCatchOrderedRule', {
      description: 'Listen to all Ordered events from Payment workflow',
      eventPattern: {
          source: ['cafe.payment'],
          detailType: ['Paid']
      },
      eventBus: centralBus,
    }).addTarget(new targets.SfnStateMachine(stateMachine,{
        input: events.RuleTargetInput.fromEventPath('$'),
      }
    ));

      // event log
      const preparedLogGroup = new logs.LogGroup(this, 'Prepaired-log', {
        logGroupName: '/aws/events/prepared',
        retention: logs.RetentionDays.ONE_DAY,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });

      const catchAll = new events.Rule(this, 'send-to-Prepared-log', {
          eventBus: centralBus,
          ruleName: 'catch-prepared',
          eventPattern: {
              source: ['cafe.serve'],
              detailType: ['Prepared']
          },
          targets: [new targets.CloudWatchLogGroup(preparedLogGroup)]
      });

      const eventBridgeRole = new iam.Role(this, 'events-role-prepared', {
          assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
      });

      preparedLogGroup.grantWrite(eventBridgeRole);

  }
}
