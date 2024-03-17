import { cacheExchange, createClient, fetchExchange, gql } from '@urql/core';

const APPSYNC_URL = process.env.APPSYNC_URL || ""
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY || ""

export const makeClient = () => {
  return createClient({
    url: APPSYNC_URL,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => {
      return {
        headers: {
          'x-api-key': APPSYNC_API_KEY,
        },
      };
    },
  });
};
