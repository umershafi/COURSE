import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin, S3StaticWebsiteOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const deploymentBucket = new Bucket(this, 'uiDeploymentBucket', {
      bucketName: `space-finder-frontend-${suffix}`
    });

    const uiDir = join(__dirname, '..', '..', '..', '..', 'space-finder-frontend', 'dist');
    if (!existsSync(uiDir)) {
      console.warn('Ui dir not found ' + uiDir);
      return;
    }

    const originIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');

    const s3Origin = S3BucketOrigin.withOriginAccessIdentity(deploymentBucket, {
      originAccessIdentity: originIdentity
    });

    deploymentBucket.grantRead(originIdentity);

    new BucketDeployment(this, 'SpacesFinderDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)]
    });

    const distribution = new Distribution(this, 'SpacesFinderDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: s3Origin
        },
      });
    new CfnOutput(this, 'SpaceFinderUrl', {
      value: distribution.distributionDomainName
    })
  }
}