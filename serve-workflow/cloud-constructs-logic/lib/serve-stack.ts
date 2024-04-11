import * as cdk from 'aws-cdk-lib';
import { StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Config } from '../../../common/cloud-constructs-logic/config/type'

import { SecretConstruct } from './parameter/secret';
import { ServeWorkflowConstruct } from './long-running-transaction/serve-workflow';


interface PaymentStackProps extends StackProps {
  config: Config;
}

export class ServeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PaymentStackProps) {
    super(scope, id, props);

    const secret = new SecretConstruct(this, 'OrderSecretResources');

    const longRunWorkflow = new ServeWorkflowConstruct(
      this, 'ServeStepfunctionsResources',
      props.config.centralEventBusARN,
      secret.slackWebhookUrl,
    );

  }
}
