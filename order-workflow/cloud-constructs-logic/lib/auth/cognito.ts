import { Construct } from 'constructs';
import { AccountRecovery, UserPool, UserPoolClient, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito'
import {
    IdentityPool,
    UserPoolAuthenticationProvider,
} from '@aws-cdk/aws-cognito-identitypool-alpha'
import { RemovalPolicy } from 'aws-cdk-lib';


export class CognitoConstruct extends Construct {
    public readonly userPool: UserPool;
    public readonly identityPool: IdentityPool;
    public readonly clientID: string;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const userPool = new UserPool(this, 'UserOrderPool', {
            selfSignUpEnabled: true,
            accountRecovery: AccountRecovery.PHONE_AND_EMAIL,
            removalPolicy: RemovalPolicy.DESTROY,
            userVerification: {
                emailStyle: VerificationEmailStyle.CODE,
            },
            autoVerify: {
                email: true,
            },
            standardAttributes: {
                email: {
                required: true,
                mutable: true,
            },
            },
        })

        const userPoolClient = new UserPoolClient(this, 'UserOrderPoolClient', {
            userPool,
        })

        const identityPool = new IdentityPool(this, 'IdentityOrderPool', {
            identityPoolName: 'identityOrderForUserData',
            allowUnauthenticatedIdentities: true,
            authenticationProviders: {
                userPools: [
                    new UserPoolAuthenticationProvider({ userPool, userPoolClient }),
                ],
            },
        })

        this.userPool = userPool;
        this.identityPool = identityPool;
        this.clientID = userPoolClient.userPoolClientId;
    }
}
