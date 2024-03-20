'use client';

import { useMemo } from 'react';
import {
  UrqlProvider,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient,
  Client,
  subscriptionExchange
} from '@urql/next';
import { createClient as createWSClient } from 'graphql-ws';
import { clientAuthExchange } from '@/lib/dataAccessClient/clientSide';

import "../globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== 'undefined'
    });

    const wsClient = createWSClient({
      url: process.env.NEXT_PUBLIC_APPSYNC_URL ||  "",
    });

    const subsucribe = subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query || '' };
        return {
          subscribe(sink) {
            const unsubscribe = wsClient.subscribe(input, sink);
            return { unsubscribe };
          },
        };
      },
    });

    const client = createClient({
      url: process.env.NEXT_PUBLIC_APPSYNC_URL || "",
      exchanges: [cacheExchange, ssr, clientAuthExchange, fetchExchange, subsucribe],
      suspense: true,
      requestPolicy: 'cache-and-network',
      fetchOptions: () => {
        return {
          headers: {
            'x-api-key': process.env.APPSYNC_API_KEY || "",
          },
          cache: "no-store",
        };
      },
    });

    return [client, ssr];
  }, []);

  return (
    <>
      <UrqlProvider client={client} ssr={ssr}>
        {children}
      </UrqlProvider>
    </>
  );
}
