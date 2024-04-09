import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import {
	Effect,
	PolicyDocument,
	PolicyStatement,
	Role,
	ServicePrincipal,
} from 'aws-cdk-lib/aws-iam'
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';


export class PaidDeriverConstruct extends Construct {
    constructor(
            scope: Construct, id: string,
            centralEventBusArn: string,
            env: {
              account: string;
              region: string;
            },
            graphqlApi: {
              arn: string,
              url: string,
            }
        ) {

        super(scope, id);

        const centralEventBus = events.EventBus.fromEventBusArn(
            this, 'ExistingEventBusInOrder3',
            centralEventBusArn,
        );

        // catch paid event
        const policyStatement = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['appsync:GraphQL'],
            resources: [`${graphqlApi.arn}/types/Mutation/*`],
        })

        const ebRuleRole = new Role(scope, 'AppSyncInvokeRole', {
          assumedBy: new ServicePrincipal('events.amazonaws.com'),
          inlinePolicies: {
            PolicyStatement: new PolicyDocument({
              statements: [policyStatement],
            }),
          },
        })

        const endpointId = cdk.Fn.select(
          0,
          cdk.Fn.split('.',cdk.Fn.select(1, cdk.Fn.split('://', graphqlApi.url)))
        );

        const graphqlEndpointArn = cdk.Fn.join('', [
          'arn:aws:appsync:',
          env.region,
          ':',
          env.account,
          ':endpoints/graphql-api/',
          endpointId
      ]);

        const deadLetterQueue = new sqs.Queue(this, 'DeadLetterQueue');

        // L2 constructはappsync target未対応
        const mycfnRule = new events.CfnRule(scope, 'paidcfnRule', {
          eventBusName: centralEventBus.eventBusName,
          name: 'derive-paid',
          description: 'Listen to all Paid events',
          eventPattern: {
              source: ['cafe.payment'],
              "detail-type": ['Paid'],
          },
          targets: [
            {
              id: 'mutateOrderStatusAppsyncTarget',
              arn: graphqlEndpointArn,
              roleArn: ebRuleRole.roleArn,
              deadLetterConfig: { arn: deadLetterQueue.queueArn },
              appSyncParameters: { // TODO: クエリ置き場を考慮（本来は自動生成かな？）
                graphQlOperation: /* GraphQL *///ここ改行とかなしでやってみる
                `mutation UpdateOrderStateView ($input: UpdateOrderStateViewInput!) {
                  updateOrderStateView(input: $input) {
                    UserID
                    OrderID
                    Status
                  }
                }
              ` ,
              },
              inputTransformer: {
                inputPathsMap: {
                    orderId: '$.detail.dynamodb.NewImage.OrderID.S',
                    userId: '$.detail.dynamodb.NewImage.UserID.S',
                    chargeResult: '$.detail.dynamodb.NewImage.ChargeResult.S',
                },
                inputTemplate: JSON.stringify({
                    "input": {
                        "OrderID": "<orderId>",
                        "UserID": "<userId>",
                        "Status": `<chargeResult>`,
                        "OrderItem": 'false',
                    }
                })
              },
            },
          ],
        })

        deadLetterQueue.grantSendMessages(new iam.ServicePrincipal('events.amazonaws.com'));

    }
}
