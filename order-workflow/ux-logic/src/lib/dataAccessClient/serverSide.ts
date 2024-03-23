import { cookies } from 'next/headers';
import { cacheExchange, createClient, fetchExchange } from '@urql/core';
import { authExchange } from "@urql/exchange-auth";
import { signOut } from 'aws-amplify/auth';
import { fetchAuthSession as severAuthSession} from 'aws-amplify/auth/server'
import { runWithAmplifyServerContext } from '@/lib/amplifyServerUtils'

const APPSYNC_URL = process.env.NEXT_PUBLIC_APPSYNC_URL|| ""

export const serverSideClient = () => {
  return createClient({
    url: APPSYNC_URL,
    exchanges: [
      cacheExchange,
      serverAuthExchange,
      fetchExchange,
    ],
    requestPolicy: 'cache-and-network',
    fetchOptions: () => {
      return {
        cache: "no-store",
      };
    }
  });
};

const serverAuthExchange = authExchange(async utils => {
  let token = await serverInitializeAuthState();
  return {
    addAuthToOperation(operation) {
      console.log("addAuthToOperation", token?.toString())
      if (!token) return operation;
      return utils.appendHeaders(operation, {
        Authorization: `Bearer ${token.toString()}`,
      });
    },
    didAuthError(error, _operation) {
      return error.graphQLErrors.some(e => e.extensions?.code === 'FORBIDDEN');
    },
    async refreshAuth() {
      await signOut();;
    },
  };
});

const serverInitializeAuthState = async () => {
  const accessToken = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await severAuthSession(contextSpec);
        return session.tokens?.accessToken
      } catch {
        return null;
      }
    },
  });
  return accessToken;
};
