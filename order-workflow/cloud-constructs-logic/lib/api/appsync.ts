import { Construct } from 'constructs';
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import {
    AppsyncFunction,
    Code,
    FunctionRuntime,
    GraphqlApi,
    InlineCode,
    Resolver,
    Definition,
    FieldLogLevel,
    AuthorizationType,
} from 'aws-cdk-lib/aws-appsync';
import * as logs from 'aws-cdk-lib/aws-logs';
import { join } from 'path';

import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha';

export class AppSyncConstruct extends Construct {
    public readonly graphqlApiArn: string;
    public readonly graphqlApiUrl: string;

    constructor(
            scope: Construct, id: string,
            userPool: UserPool,
            identityPool: IdentityPool,
            orderedEventStore: TableV2,
            orderStateView: TableV2,
        ) {

        super(scope, id);

        // AppSync GraphQL API
        const OrderAppSyncApi = new GraphqlApi(this, 'OrderAppSyncApi', {
            name: 'OrderAppsyncAPI',
            definition: Definition.fromFile(join(__dirname, 'schema.graphql')),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: AuthorizationType.USER_POOL,
                    userPoolConfig: {
                        userPool,
                    },
                },
                additionalAuthorizationModes: [
                    {
                        authorizationType: AuthorizationType.IAM,
                    },
                ],
            },
            logConfig: {
                retention: logs.RetentionDays.ONE_WEEK,
                fieldLogLevel: FieldLogLevel.ALL
            },
        });

        OrderAppSyncApi.grantQuery(identityPool.unauthenticatedRole, 'getOrdersByUserID')

        // AppSync Data Source -> DynamoDB table
        const EventStoreSource = OrderAppSyncApi.addDynamoDbDataSource(
            'OrderedEventSource',
            orderedEventStore,
        );

        const ViewCacheSource = OrderAppSyncApi.addDynamoDbDataSource(
            'OrderedViewCacheSource',
            orderStateView,
        );

        // Functions and Resolvers
        const createOrderFunction = new AppsyncFunction(this, 'createOrderFunction', {
            name: 'createOrderFunction',
            api: OrderAppSyncApi,
            dataSource: EventStoreSource,
            code: Code.fromAsset(join(__dirname, '/mappings/ordered-store/Mutation.createOrder.js')),
            runtime: FunctionRuntime.JS_1_0_0,
        });

        const getOrderedListByUserFunc = new AppsyncFunction(
            this,
            'getOrderListByUserFunction',
            {
                name: 'getOrderListByUserFunction',
                api: OrderAppSyncApi,
                dataSource: ViewCacheSource,
                code: Code.fromAsset(
                    join(__dirname, '/mappings/ordered-view-cache/Query.getOrderListByUser.js')
                ),
                runtime: FunctionRuntime.JS_1_0_0,
            }
        );

        const passthrough = InlineCode.fromInline(`
            export function request(...args) {
                console.log(args);
                return {}
            }

            export function response(ctx) {
                return ctx.prev.result
            }
        `);

        const createOrderResolver = new Resolver(this, 'createOrderResolver', {
            api: OrderAppSyncApi,
            typeName: 'Mutation',
            fieldName: 'createOrder',
            runtime: FunctionRuntime.JS_1_0_0,
            pipelineConfig: [createOrderFunction],
            code: passthrough,
        });

        const getOrderListByUserResolver = new Resolver(
            this,
            'getOrderListByUserResolver',
            {
                api: OrderAppSyncApi,
                typeName: 'Query',
                fieldName: 'getOrdersByUserID',
                runtime: FunctionRuntime.JS_1_0_0,
                pipelineConfig: [getOrderedListByUserFunc],
                code: passthrough,
            }
        );

        this.graphqlApiArn = OrderAppSyncApi.arn;
        this.graphqlApiUrl = OrderAppSyncApi.graphqlUrl;
    }
}
