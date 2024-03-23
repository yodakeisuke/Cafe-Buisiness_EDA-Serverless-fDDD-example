;import { authExchange } from "@urql/exchange-auth";
import { fetchAuthSession, signOut } from 'aws-amplify/auth';

const initializeAuthState = async () => {
  try {
    const {
      tokens,
    } = await fetchAuthSession();
    console.log('initializeAuthState', tokens);
    const {
      accessToken,
    } = tokens || {};

    return {
      accessToken,
    };
  } catch {
    return null;
  }
};

export const clientAuthExchange = authExchange(async utils => {
  let token = await initializeAuthState();
  return {
    addAuthToOperation(operation) {
      console.log("addAuthToOperation", token?.accessToken?.toString())
      if (!token) return operation;
      return utils.appendHeaders(operation, {
        Authorization: `Bearer ${token.accessToken?.toString()}`,
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
