import { Construct } from 'constructs';

import { aws_lambda as lambda } from "aws-cdk-lib";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { aws_stepfunctions as sfn } from "aws-cdk-lib";
import { aws_stepfunctions_tasks as tasks } from "aws-cdk-lib";
import { DefinitionBody } from 'aws-cdk-lib/aws-stepfunctions';
import { aws_events as events } from "aws-cdk-lib";
import { aws_events_targets as targets } from "aws-cdk-lib";
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as path from "path";


export class PaymentWorkflowConstruct extends Construct {

  constructor(
          scope: Construct, id: string,
          centralEventBusArn: string,
          paymentEventStore: TableV2,
      ) {

      super(scope, id);

    // lambda
    const validationLogic = new NodejsFunction(this, 'ValidateLambda', {
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      entry: path.join(__dirname, '../../../business-logic/validate-payment.ts'),
      bundling: {
          forceDockerBundling: false,
      },
  });

    // states
    const retrieveCardInfoTask = new sfn.Pass(this, 'AddCardNumber', {
      parameters: {
        'NewImage.$': '$.detail.dynamodb.NewImage',
        'cardNumber': '1111-1111-1111-1111'
      },
      resultPath: '$.detail.dynamodb'
    });

    const cardValidateTask = new tasks.LambdaInvoke(
      this,
        "validate-card-info", {
        lambdaFunction: validationLogic,
      }
    );

    // Stripeのテスト用endpointをコール
    // これ来そうなのでhttp直接統合は待つ
    // https://github.com/aws/aws-cdk/issues/28278

    // todo: db write 直接統合するstep
    const ddbWrite = new tasks.DynamoPutItem(
      this,
      "payment-ddb-write-job", {
        item: {
          UserID: tasks.DynamoAttributeValue.fromString(
            sfn.JsonPath.stringAt('$.Payload.invoice.UserID')
          ),
          PaymentDateTime: tasks.DynamoAttributeValue.fromString(
            new Date().toISOString(), // TODO: stripeの結果
          ),
          OrderID: tasks.DynamoAttributeValue.fromString(
            sfn.JsonPath.stringAt('$.Payload.invoice.OrderID')
          ),
          ChargeResult: tasks.DynamoAttributeValue.fromString(
            sfn.JsonPath.stringAt('$.Payload.invoice.ChargeResult')
          ),
        },
        table: paymentEventStore,
      }
    );

    // workflow as chanable
    const definition = retrieveCardInfoTask
                        .next(cardValidateTask)
                        .next(ddbWrite);

    // state machine
    const sfnLogGroup = new logs.LogGroup(this, 'stpLogGroup');
    const stateMachine = new sfn.StateMachine(this, 'PaymentStateMachine', {
      definitionBody: DefinitionBody.fromChainable(definition),
      stateMachineType: sfn.StateMachineType.EXPRESS,
      stateMachineName: 'PaymentStateMachine',
      logs: {
        destination: sfnLogGroup,
        level: sfn.LogLevel.ALL,
      }
    });

    // catch order event
    const centralBus = events.EventBus.fromEventBusArn(
      this, 'centralEventBusOfpayment', centralEventBusArn
    );

    new events.Rule(this, 'PaymentCatchOrderedRule', {
      description: 'Listen to all Ordered events from Payment workflow',
      eventPattern: {
          source: ['cafe.order'],
          detailType: ['Ordered']
      },
      eventBus: centralBus,
    }).addTarget(new targets.SfnStateMachine(stateMachine,{
        input: events.RuleTargetInput.fromEventPath('$'),
      }
    ));
  }
}
