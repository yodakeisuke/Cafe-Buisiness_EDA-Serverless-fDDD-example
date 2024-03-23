#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OrderStack } from '../lib/order_stack';

import { DEVConfig } from  '../../../common/cloud-constructs-logic/config/dev';

const app = new cdk.App();

new OrderStack(app, 'OrderAppStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  config: DEVConfig,
});
