import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EventBus } from 'aws-cdk-lib/aws-events';

export class EventBusStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cafeBusinessCentralBus = new EventBus(this, 'cafe-business-central', {
      eventBusName: 'cafe-business-central-bus',
    });
  }
}
