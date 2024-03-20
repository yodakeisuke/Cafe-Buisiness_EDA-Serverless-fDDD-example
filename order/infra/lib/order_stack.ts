import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { CognitoConstruct } from './auth/cognito';
import { DataAppSyncConstruct } from './data/data-appsync';
import { UILambdaConstruct } from './ui/ui-lambda';


export class OrderStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const auth = new CognitoConstruct(this, 'MyCognitoResources');

        const dataLayer = new DataAppSyncConstruct(
            this,
            'MyAppSyncResources',
            auth.userPool,
            auth.identityPool,
        );

        const uiLayer = new UILambdaConstruct(
            this,
            'MyUILambdaResources',
            dataLayer.graphqlApiArn,
            dataLayer.graphqlApiUrl,
            dataLayer.graphqlApiKey,
        );
    }
}
