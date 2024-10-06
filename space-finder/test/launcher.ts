import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = "us-west-1";
process.env.TABLE_NAME = 'SpaceTable-0621f759b80b'

handler({
  httpMethod: 'POST',
  body: JSON.stringify({
    location: 'London updated'
  })
} as any, {} as any).then(result => {
  console.log(result);
});