import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration } from 'aws-cdk-lib';
import { DockerImageCode, DockerImageFunction, FunctionUrlAuthType, InvokeMode, FunctionUrl } from 'aws-cdk-lib/aws-lambda';

export class UILambdaConstruct extends Construct {
    constructor(
            scope: Construct, id: string,
            appsyncArn: string,
            appsyncUrl: string,
            appsyncApiKey: string,
        ) {
        super(scope, id);

        const repository = ecr.Repository.fromRepositoryName(this, 'repo', 'order-frontend');

        const handler = new DockerImageFunction(this, 'next', {
            code: DockerImageCode.fromEcr(repository),
            memorySize: 256,
            timeout: Duration.seconds(30),
            environment: {
                APPSYNC_URL: appsyncUrl,
                APPSYNC_API_KEY: appsyncApiKey,
            },
        });

        handler.addToRolePolicy(new iam.PolicyStatement({
            actions: ['appsync:GraphQL'],
            resources: [appsyncArn],
        }));

        const url = handler.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            invokeMode: InvokeMode.RESPONSE_STREAM,
            // cors: {
            //  allowedMethods: [HttpMethod.ALL],
            //  allowedOrigins: ["https://dev.classmethod.jp"],
            // },
        });

        const cfDistribution = new cloudfront.CloudFrontWebDistribution(this, 'CFDistribution', {
            originConfigs: [
                {
                    customOriginSource: {
                        domainName: this.getURLDomain(url),
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
        });

        new cdk.CfnOutput(this, 'CloudFrontDistributionURL', {
            value: cfDistribution.distributionDomainName,
        });
        new cdk.CfnOutput(this, 'URLDomain', {
            value: this.getURLDomain(url),
        });
    }

    private getURLDomain(lambdaUrl: FunctionUrl): string {
        return cdk.Fn.select(2, cdk.Fn.split('/', lambdaUrl.url));
    }
}
