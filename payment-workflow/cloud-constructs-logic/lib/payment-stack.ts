import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Config } from '../../../common/cloud-constructs-logic/config/type'
import { PaymentWorkflowConstruct } from './orchestration/payment-workflow';
import { PaymentEventStoreConstruct } from './data/event-store';

interface PaymentStackProps extends StackProps {
    config: Config;
}

export class PaymentStack extends Stack {
  constructor(scope: Construct, id: string, props: PaymentStackProps) {
    super(scope, id, props);

    const eventStore = new PaymentEventStoreConstruct(
      this, 'PaymentEventStoreResources',
      props.config.centralEventBusARN,
    )

    const workflow = new PaymentWorkflowConstruct(
      this, 'PaymentStepfunctionsResources',
      props.config.centralEventBusARN,
      eventStore.PaymentEventStore,
    );

  }
}
