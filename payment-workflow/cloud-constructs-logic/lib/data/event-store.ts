import { Construct } from 'constructs';
import { AttributeType, TableV2, Billing, ProjectionType, StreamViewType } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

import * as events from 'aws-cdk-lib/aws-events';
import { Rule } from 'aws-cdk-lib/aws-events';
import { CloudWatchLogGroup } from 'aws-cdk-lib/aws-events-targets';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';


export class PaymentEventStoreConstruct extends Construct {
    public readonly PaymentEventStore: TableV2;

    constructor(
            scope: Construct, id: string,
            centralEventBusArn: string,
        ) {

        super(scope, id);

        /* Event Store */
        const PaidEventTable = new TableV2(this, 'PaidEventTable', {
            partitionKey: { name: 'UserID', type: AttributeType.STRING },
            sortKey: { name: 'PaymentDateTime', type: AttributeType.STRING },
            billing: Billing.onDemand(),
            removalPolicy: RemovalPolicy.DESTROY,
            localSecondaryIndexes: [
                {
                    indexName: 'ChargeResultIndex',
                    sortKey: { name: 'ChargeResult', type: AttributeType.STRING },
                    projectionType: ProjectionType.ALL,
                },
            ],
            dynamoStream: StreamViewType.NEW_IMAGE
        });

        /* Change Data Capture  */
        const centralEventBus = events.EventBus.fromEventBusArn(
            this, 'ExistingEventBusInPayment',
            centralEventBusArn
        );

        // log group to see output
        const orderLogGroup = new LogGroup(this, 'Paid-log', {
            logGroupName: '/aws/events/Paid',
            retention: RetentionDays.ONE_DAY,
            removalPolicy: RemovalPolicy.DESTROY
        });

        // Rule that matches any incoming event and sends it to a logGroup
        const catchAll = new Rule(this, 'send-to-Paid-log', {
            eventBus: centralEventBus,
            ruleName: 'catch-Paid',
            eventPattern: {
                source: ['cafe.payment'],
                detailType: ['Paid']
            },
            targets: [new CloudWatchLogGroup(orderLogGroup)]
        });

        const eventBridgeRole = new Role(this, 'events-role', {
            assumedBy: new ServicePrincipal('events.amazonaws.com'),
        });

        orderLogGroup.grantWrite(eventBridgeRole);

        const pipeRole = new Role(this, 'pipe-role-payment', {
            assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
        });

        PaidEventTable.grantStreamRead(pipeRole);
        centralEventBus.grantPutEventsTo(pipeRole);

        // Create new Pipe
        const pipe = new CfnPipe(this, 'Paid-pipe', {
            roleArn: pipeRole.roleArn,
            //@ts-ignore
            source: PaidEventTable.tableStreamArn,
            sourceParameters: {
            dynamoDbStreamParameters: {
                startingPosition: StartingPosition.LATEST,
                batchSize: 1,
            },
            filterCriteria: {
                filters: [
                {
                    pattern: '{"eventName" : ["INSERT"] }',
                },
                ],
            },
            },
            // enrichment: splitterFunc.functionArn,
            target: centralEventBusArn,
            targetParameters: {
                eventBridgeEventBusParameters: {
                    detailType: 'Paid',
                    source: 'cafe.payment',
                },
            },
        });

        this.PaymentEventStore = PaidEventTable;
    }
}
