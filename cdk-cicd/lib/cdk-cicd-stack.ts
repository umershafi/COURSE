import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'AwesomePipeline', {
      pipelineName: 'AwesomePipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('umershafi/COURSE', 'cicd'),
        commands: [
          'cd cdk-cicd',
          'npm ci',
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'ckd-cicd/cdk.out'
      })
    })
  }
}
