import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import { DockerImageCode, DockerImageFunction, FunctionUrlAuthType, InvokeMode, FunctionUrl } from 'aws-cdk-lib/aws-lambda';


export class UILambdaStack extends cdk.Stack {
  readonly endpoint: string;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id);

    const repository = ecr.Repository.fromRepositoryName(this, 'repo', 'order-frontend');

    const handler = new DockerImageFunction(this, 'next', {
      code: DockerImageCode.fromEcr(repository),
      memorySize: 256,
      timeout: Duration.seconds(30),
    });

    const url = handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      invokeMode: InvokeMode.RESPONSE_STREAM,
      // cors: {
      //  allowedMethods: [HttpMethod.ALL],
         // allowedOrigins: ["https://dev.classmethod.jp"],
      // },
    });

    const cfDistribution = new cloudfront.CloudFrontWebDistribution(this, 'CFDistribution', {
      originConfigs: [
          {
              customOriginSource: {
                  domainName: getURLDomain(url),
              },
              behaviors: [{
                  isDefaultBehavior: true
              }],
          },
      ],
  });

  new cdk.CfnOutput(this, 'CloudFrontDistributionURL', {
    value: cfDistribution.distributionDomainName,
});

  new cdk.CfnOutput(this, 'URLDomain', {
      value: getURLDomain(url),
  });

  }
}

const getURLDomain = (lambdaUrl: FunctionUrl) => {
  return cdk.Fn.select(2, cdk.Fn.split('/', lambdaUrl.url));
}
