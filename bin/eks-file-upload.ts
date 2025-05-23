#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ExistingEksStack } from '../lib/eks-stack';

const app = new cdk.App();
new ExistingEksStack(app, 'AdotEksCdkStack', {
  env: {
    account: '131332286832',
    region: 'us-east-1',
  },
});
