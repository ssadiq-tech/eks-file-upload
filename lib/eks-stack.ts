import * as cdk from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class ExistingEksStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get OIDC provider ARN from your existing cluster
    const oidcArn = `arn:aws:iam::131332286832:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/883752FFF3EFBDB7B44543F17F0C3358`;

    // Import existing cluster
    const cluster = eks.Cluster.fromClusterAttributes(this, 'AdotEksCluster', {
      clusterName: 'adot-eks-clusters',
      kubectlRoleArn: `arn:aws:iam::131332286832:role/kubectlrole`,
      openIdConnectProvider: eks.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
        this,
        'ClusterOIDCProvider',
        oidcArn
      ),
    });


    // Add manifests using KubernetesManifest construct
    new eks.KubernetesManifest(this, 'NginxDeployment', {
      cluster,
      manifest: [{
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: { name: 'nginx' },
        spec: {
          replicas: 2,
          selector: { matchLabels: { app: 'nginx' } },
          template: {
            metadata: { labels: { app: 'nginx' } },
            spec: {
              containers: [{
                name: 'nginx',
                image: 'nginx:latest',
                ports: [{ containerPort: 80 }]
              }]
            }
          }
        }
      }]
    });
  }
}
