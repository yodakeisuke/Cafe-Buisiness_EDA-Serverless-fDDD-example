import { Construct } from 'constructs';
import { AttributeType, TableV2, Billing, ProjectionType, StreamViewType } from 'aws-cdk-lib/aws-dynamodb';

import { RemovalPolicy } from 'aws-cdk-lib';

export class DataAppSyncConstruct extends Construct {
    public readonly orderedEventStore: TableV2;
    public readonly orderStateView: TableV2;

    constructor(
            scope: Construct, id: string,
        ) {

        super(scope, id);

        const OrderedEventTable = new TableV2(this, 'OrderedEventTable', {
            partitionKey: { name: 'UserID', type: AttributeType.STRING },
            sortKey: { name: 'OrderDateTime', type: AttributeType.STRING },
            billing: Billing.onDemand(),
            removalPolicy: RemovalPolicy.DESTROY,
            localSecondaryIndexes: [
                {
                    indexName: 'StatusIndex',
                    sortKey: { name: 'Status', type: AttributeType.STRING },
                    projectionType: ProjectionType.ALL,
                },
            ],
            dynamoStream: StreamViewType.NEW_IMAGE
        });

        const OrdereStateView = new TableV2(this, 'OrderStateCacheTable', {
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

        this.orderedEventStore = OrderedEventTable;
        this.orderStateView = OrdereStateView;
    }
}
