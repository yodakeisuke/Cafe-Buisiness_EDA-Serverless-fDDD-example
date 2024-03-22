import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { CognitoConstruct } from './auth/cognito';
import { DataAppSyncConstruct } from './data/data-appsync';
import { CDCTableToBusConstruct } from './data/change-data-cpture'
import { UILambdaConstruct } from './ui/ui-lambda';

import { Config } from '../../../common/infra//config/type'


interface OrderStackProps extends StackProps {
    config: Config;
}

export class OrderStack extends Stack {
    constructor(scope: Construct, id: string, props: OrderStackProps) {
        super(scope, id, props);

        const auth = new CognitoConstruct(this, 'MyCognitoResources');

        const dataLayer = new DataAppSyncConstruct(
            this, 'MyAppSyncResources',
            auth.userPool,
            auth.identityPool,
        );

        const cdcPipe = new CDCTableToBusConstruct(
            this, 'MyCDCPipe',
            props.config.centralEbentBusARN,
            dataLayer.table
        )

        const uiLayer = new UILambdaConstruct(
            this, 'MyUILambdaResources',
            dataLayer.graphqlApiArn,
            dataLayer.graphqlApiUrl,
            dataLayer.graphqlApiKey,
        );
    }
}
