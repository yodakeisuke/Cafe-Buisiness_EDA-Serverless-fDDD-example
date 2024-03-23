import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { CognitoConstruct } from './auth/cognito';
import { DataAppSyncConstruct } from './data/tables';
import { CDCTableToBusConstruct } from './data/change-data-cpture'
import { AppSyncConstruct } from './api/appsync';
import { UILambdaConstruct } from './ui/ui-lambda';

import { Config } from '../../../common/cloud-constructs-logic/config/type'


interface OrderStackProps extends StackProps {
    config: Config;
}

export class OrderStack extends Stack {
    constructor(scope: Construct, id: string, props: OrderStackProps) {
        super(scope, id, props);

        const auth = new CognitoConstruct(
            this, 'OrderCognitoResources'
        );

        const dataLayer = new DataAppSyncConstruct(
            this, 'OrderDataResource',
        );

        const cdcPipe = new CDCTableToBusConstruct(
            this, 'OrderedCDCPipe',
            props.config.centralEbentBusARN,
            dataLayer.orderedEventStore
        )

        const apiLayer =  new AppSyncConstruct(
            this, 'OrderUserAPI',
            auth.userPool,
            auth.identityPool,
            dataLayer.orderStateView,
            dataLayer.orderStateView,
        )

        const uiLayer = new UILambdaConstruct(
            this, 'OrderUILambdaResources',
            apiLayer.graphqlApiArn,
            apiLayer.graphqlApiUrl,
            apiLayer.graphqlApiKey,
        );
    }
}
