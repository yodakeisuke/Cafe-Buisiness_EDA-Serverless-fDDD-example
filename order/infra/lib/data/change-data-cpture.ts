import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import { Rule, Match } from 'aws-cdk-lib/aws-events';
import { CloudWatchLogGroup } from 'aws-cdk-lib/aws-events-targets';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { RemovalPolicy } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { join } from 'path';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';


export class CDCTableToBusConstruct extends Construct {
    constructor(
            scope: Construct, id: string,
            centralEventBusArn: string,
            sourceTable: ITable,
        ) {

        super(scope, id);

        /* Change Data Capture  */
        const centralEventBus = events.EventBus.fromEventBusArn(this, 'ExistingEventBusInOrder', centralEventBusArn);

        // log group to see output
        const orderLogGroup = new LogGroup(this, 'orders-log', {
            logGroupName: '/aws/events/orders',
            retention: RetentionDays.ONE_DAY,
            removalPolicy: RemovalPolicy.DESTROY
        });

        // Rule that matches any incoming event and sends it to a logGroup
        const catchAll = new Rule(this, 'send-to-log', {
            eventBus: centralEventBus,
            ruleName: 'catchall',
            eventPattern: {
                // orderEventのみにする
                source:  Match.exists()
            },
        targets: [new CloudWatchLogGroup(orderLogGroup)]
        } );

        const eventBridgeRole = new Role(this, 'events-role', {
            assumedBy: new ServicePrincipal('events.amazonaws.com'),
        });

        orderLogGroup.grantWrite(eventBridgeRole);

        const pipeRole = new Role(this, 'pipe-role', {
            assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
        });

        sourceTable.grantStreamRead(pipeRole);
        centralEventBus.grantPutEventsTo(pipeRole);

        // Create new Pipe
        const pipe = new CfnPipe(this, 'pipe', {
            roleArn: pipeRole.roleArn,
            //@ts-ignore
            source: sourceTable.tableStreamArn,
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
            target: centralEventBus.eventBusArn,
            targetParameters: {
                eventBridgeEventBusParameters: {
                    detailType: 'Ordered',
                    source: 'cafe.order',
                },
            },
        });
    }
}
