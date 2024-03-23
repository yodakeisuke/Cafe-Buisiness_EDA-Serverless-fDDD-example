import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { CognitoConstruct } from './auth/cognito';
import { EventStoreConstruct } from './data/event-store';
import { ReadModelConstruct } from './data/read-model'
import { AppSyncConstruct } from './api/appsync';
import { UILambdaConstruct } from './ui/ui-lambda';

import { Config } from '../../../common/cloud-constructs-logic/config/type'


interface OrderWorkflowStackProps extends StackProps {
    config: Config;
}

export class OrderWorkflowStack extends Stack {
    constructor(scope: Construct, id: string, props: OrderWorkflowStackProps) {
        super(scope, id, props);

        const auth = new CognitoConstruct(
            this, 'OrderCognitoResources'
        );

        const dataLayerFact = new EventStoreConstruct(
            this, 'OrderDataResource',
            props.config.centralEbentBusARN,
        );

        const dataLayerView = new ReadModelConstruct(
            this, 'OrderStateCache',
            props.config.centralEbentBusARN,
        )

        const apiLayer =  new AppSyncConstruct(
            this, 'OrderUserAPI',
            auth.userPool,
            auth.identityPool,
            dataLayerFact.orderedEventStore,
            dataLayerView.orderStateView,
        )

        const uiLayer = new UILambdaConstruct(
            this, 'OrderUILambdaResources',
            apiLayer.graphqlApiArn,
            apiLayer.graphqlApiUrl,
            auth.userPool.userPoolId,
            auth.identityPool.identityPoolId,
            auth.clientID,
        );
    }
}
