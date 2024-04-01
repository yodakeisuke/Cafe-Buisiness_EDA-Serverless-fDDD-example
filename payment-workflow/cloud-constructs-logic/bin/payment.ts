#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {  PaymentStack } from '../lib/payment-stack';

import { DEVConfig } from  '../../../common/cloud-constructs-logic/config/dev';


const app = new cdk.App();
new PaymentStack(app, 'PaymentStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  config: DEVConfig,
});
