import { Construct } from 'constructs';
import { AttributeType, TableV2, Billing, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import {
    AppsyncFunction,
    Code,
    FunctionRuntime,
    GraphqlApi,
    InlineCode,
    Resolver,
    Definition,
    FieldLogLevel,
} from 'aws-cdk-lib/aws-appsync';
import * as logs from 'aws-cdk-lib/aws-logs';
import { join } from 'path';

export class DataAppSyncConstruct extends Construct {
    public readonly graphqlApiArn: string;
    public readonly graphqlApiUrl: string;
    public readonly graphqlApiKey: string;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // DynamoDB Table
        const OrderEventTable = new TableV2(this, 'OrderEventTable', {
            partitionKey: { name: 'UserID', type: AttributeType.STRING },
            sortKey: { name: 'OrderDateTime', type: AttributeType.STRING },
            billing: Billing.onDemand(),
            localSecondaryIndexes: [
                {
                    indexName: 'StatusIndex',
                    sortKey: { name: 'Status', type: AttributeType.STRING },
                    projectionType: ProjectionType.ALL,
                },
            ],
        });

        // AppSync GraphQL API
        const OrderAppSyncApi = new GraphqlApi(this, 'OrderAppSyncApi', {
            name: 'OrderAppsyncAPI',
            definition: Definition.fromFile(join(__dirname, 'schema.graphql')),
            logConfig: {
                retention: logs.RetentionDays.ONE_WEEK,
                fieldLogLevel: FieldLogLevel.ALL
            },
        });

        // AppSync Data Source -> DynamoDB table
        const DDBDataSource = OrderAppSyncApi.addDynamoDbDataSource(
            'DDBDataSource',
            OrderEventTable,
        );

        // Functions and Resolvers
        const getOrderListByUserFunc = new AppsyncFunction(
            this,
            'getOrderListByUserFunction',
            {
                name: 'getOrderListByUserFunction',
                api: OrderAppSyncApi,
                dataSource: DDBDataSource,
                code: Code.fromAsset(
                    join(__dirname, '/mappings/Query.getOrderListByUser.js')
                ),
                runtime: FunctionRuntime.JS_1_0_0,
            }
        );

        const createOrderFunction = new AppsyncFunction(this, 'createOrderFunction', {
            name: 'createOrderFunction',
            api: OrderAppSyncApi,
            dataSource: DDBDataSource,
            code: Code.fromAsset(join(__dirname, '/mappings/Mutation.createOrder.js')),
            runtime: FunctionRuntime.JS_1_0_0,
        });

        const passthrough = InlineCode.fromInline(`
            export function request(...args) {
                console.log(args);
                return {}
            }

            export function response(ctx) {
                return ctx.prev.result
            }
        `);

        const getOrderListByUserResolver = new Resolver(
            this,
            'getOrderListByUserResolver',
            {
                api: OrderAppSyncApi,
                typeName: 'Query',
                fieldName: 'listOrders',
                runtime: FunctionRuntime.JS_1_0_0,
                pipelineConfig: [getOrderListByUserFunc],
                code: passthrough,
            }
        );

        const createOrderResolver = new Resolver(this, 'createOrderResolver', {
            api: OrderAppSyncApi,
            typeName: 'Mutation',
            fieldName: 'createOrder',
            runtime: FunctionRuntime.JS_1_0_0,
            pipelineConfig: [createOrderFunction],
            code: passthrough,
        });

        this.graphqlApiArn = OrderAppSyncApi.arn;
        this.graphqlApiUrl = OrderAppSyncApi.graphqlUrl;
        this.graphqlApiKey = OrderAppSyncApi.apiKey || '';
    }
}
