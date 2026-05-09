import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { inMemoryStorage } from "./inMemoryStorage";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ["email", "openid", "profile"],
          redirectSignIn: [import.meta.env.VITE_APP_URL ?? window.location.origin],
          redirectSignOut: [import.meta.env.VITE_APP_URL ?? window.location.origin],
          responseType: "code"
        }
      }
    }
  }
});

cognitoUserPoolsTokenProvider.setKeyValueStorage(inMemoryStorage);
