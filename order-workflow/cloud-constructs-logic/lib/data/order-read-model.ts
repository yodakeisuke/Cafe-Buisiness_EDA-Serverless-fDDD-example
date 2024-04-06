import { Construct } from 'constructs';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';

import * as events from 'aws-cdk-lib/aws-events';
import { Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

import { AttributeType, TableV2, Billing, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';


export class ReadModelConstruct extends Construct {
    public readonly orderStateView: TableV2;

    constructor(
            scope: Construct, id: string,
            centralEventBusArn: string,
        ) {

        super(scope, id);

        const centralEventBus = events.EventBus.fromEventBusArn(
            this, 'ExistingEventBusInOrder2',
            centralEventBusArn,
        );

        /* Read Model */
        const orderStateView = new TableV2(this, 'OrderStateCacheTable', {
            partitionKey: { name: 'UserID', type: AttributeType.STRING },
            sortKey: { name: 'OrderID', type: AttributeType.STRING },
            billing: Billing.onDemand(),
            removalPolicy: RemovalPolicy.DESTROY,
            localSecondaryIndexes: [
                {
                    indexName: 'StatusIndex',
                    sortKey: { name: 'Status', type: AttributeType.STRING },
                    projectionType: ProjectionType.ALL,
                },
            ],
        });

        /* Derive from Event */
        const OrderedConsumer = new NodejsFunction(this, 'orderedConsumer', {
            memorySize: 1024,
            timeout: Duration.seconds(5),
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            entry: join(__dirname, '../../../business-logic/derive-order-state/from-ordered-event.ts'),
            bundling: {
                forceDockerBundling: false,
            },
            environment: {
                TABLE_NAME: orderStateView.tableName,
            }
        });
        orderStateView.grantReadWriteData(OrderedConsumer);

        // catch ordered event
        new Rule(this, 'OrderedRule', {
            description: 'Listen to all Ordered events',
            eventPattern: {
                source: ['cafe.order'],
                detailType: ['Ordered']
            },
            eventBus: centralEventBus,
        }).addTarget(new LambdaFunction(OrderedConsumer));

        this.orderStateView = orderStateView;
    }
}
