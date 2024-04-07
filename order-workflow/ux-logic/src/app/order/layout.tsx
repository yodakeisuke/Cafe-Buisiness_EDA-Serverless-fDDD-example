'use client';

import { useMemo } from 'react';
import {
  UrqlProvider,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient,
} from '@urql/next';
import { generateClient } from 'aws-amplify/api';
import { clientAuthExchange } from '@/lib/dataAccessClient/clientSide';

import "../globals.css";
import OrderUpdateSubscriber from '../_components/order_state/OrderSubscriber';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [client, subscriptionClient, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== 'undefined'
    });

    const client = createClient({
      url: process.env.NEXT_PUBLIC_APPSYNC_URL || "",
      exchanges: [cacheExchange, ssr, clientAuthExchange, fetchExchange],
      suspense: true,
      requestPolicy: 'cache-and-network',
    });

    const subscriptionClient = generateClient();

    return [client, subscriptionClient, ssr];
  }, []);

  return (
    <>
      <UrqlProvider client={client} ssr={ssr}>
        <OrderUpdateSubscriber client={subscriptionClient}>
          {children}
        </OrderUpdateSubscriber>
      </UrqlProvider>
    </>
  );
}
