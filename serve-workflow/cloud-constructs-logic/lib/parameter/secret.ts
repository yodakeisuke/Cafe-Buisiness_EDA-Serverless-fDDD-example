import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_secretsmanager as secretsmanager } from 'aws-cdk-lib';

export class SecretConstruct extends Construct {
  public readonly slackWebhookUrl: cdk.aws_secretsmanager.ISecret;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const secret = secretsmanager.Secret.fromSecretNameV2(
      this, 'Secret',
      'slack-webhook-url',
    );

    this.slackWebhookUrl = secret;
  }
}
