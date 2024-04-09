#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServeStack } from '../lib/serve-stack';

import { DEVConfig } from  '../../../common/cloud-constructs-logic/config/dev';


const app = new cdk.App();
new ServeStack(app, 'ServeStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  config: DEVConfig,
});
