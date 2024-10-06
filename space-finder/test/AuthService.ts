import { Amplify } from 'aws-amplify'
import { SignInOutput, fetchAuthSession, signIn } from '@aws-amplify/auth'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'

const awsRegion = 'us-west-1'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-west-1_fBPRFLWMR',
      userPoolClientId: '6ptppttpckm7kkote1fdl560do',
      identityPoolId: 'us-west-1:ca13f863-d510-4980-b233-2aed65d93148'
    }
  }
})

export class AuthService {

  public async login(userName: string, password: string) {
    const signInOutput: SignInOutput = await signIn({
      username: userName,
      password: password,
      options: {
        authFlowType: 'USER_PASSWORD_AUTH'
      }
    });
    return signInOutput;
  }

  // call only after login
  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.idToken?.toString();
  }

  public async generateTemporaryCredentials() {
    const idToken = await this.getIdToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-west-1_fBPRFLWMR`
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: 'us-west-1:ca13f863-d510-4980-b233-2aed65d93148',
        logins: {
          [cognitoIdentityPool]: idToken
        }
      })
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}