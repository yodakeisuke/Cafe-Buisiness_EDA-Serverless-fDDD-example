import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import { aws_events_targets as targets } from "aws-cdk-lib";
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from "path";


export class PreparedDeriverConstruct extends Construct {
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
            apikey: string,
        }
    ) {
        super(scope, id);

        const centralEventBus = events.EventBus.fromEventBusArn(
            this, 'ExistingEventBusInOrder4',
            centralEventBusArn,
        );

        // Lambda function to call AppSync
        const appsyncLambda = new NodejsFunction(this, 'PushPreparedEventFunction', {
            handler: 'index.handler',
            entry: path.join(__dirname, '../../../business-logic/derive-order-state/from-prepared-event.ts'),
            environment: {
                AWS_ACCOUNT: env.account,
                APPSYNC_ENDPOINT_URL: graphqlApi.url,
                APPSYNC_API_KEY: graphqlApi.apikey,
            },
            bundling: {
                forceDockerBundling: false,
            },
        });

        // Grant necessary permissions to the Lambda function
        appsyncLambda.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['appsync:GraphQL'],
            resources: [`${graphqlApi.arn}/types/Mutation/*`],
        }));

        const deadLetterQueue = new sqs.Queue(this, 'DeadLetterQueue');
        deadLetterQueue.grantSendMessages(new iam.ServicePrincipal('events.amazonaws.com'));

        // EventBridge Rule
        const ebRule = new events.Rule(this, 'PreparedRule', {
            eventBus: centralEventBus,
            ruleName: 'derive-prepared',
            description: 'Listen to all prepared events and trigger Lambda',
            eventPattern: {
                source: ['cafe.serve'],
                detailType: ['Prepared'],
            },
            targets: [
                new targets.LambdaFunction(appsyncLambda, {
                    deadLetterQueue: deadLetterQueue,
                    retryAttempts: 2,
                }),
            ],
        });
    }
}
