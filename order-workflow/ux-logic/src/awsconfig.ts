import { ResourcesConfig } from 'aws-amplify'

export const config: ResourcesConfig = {
   Auth: {
		Cognito: {
      identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITYPOOLID || "",
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOLID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USERPOOLWEBCLIENTID || "",
		},
	},
};
