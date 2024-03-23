import React from 'react';
import { Suspense } from 'react';
import { cookies } from 'next/headers';

import { useSubscription } from '@urql/next';
import { registerUrql } from '@urql/next/rsc';
import { serverSideClient } from '@/lib/dataAccessClient/serverSide';
import { ListAllOrdersByUserQuery } from '@/lib/query';

import { ScrollArea } from "@/app/_components/ui/scroll-area"

import { ORDERS, Order } from './models';
import { OrderStateItem } from './OrderStateItem';


const { getClient } = registerUrql(serverSideClient);

const handleSubscription = (messages = [], response: any) => {
  return [response.newMessages, ...messages];
};

export const OrderStatus = ()  => {
  return (
    <Suspense>
      <OrderStatusList />
    </Suspense>
  );
}
// TODO: cache refresh
export const OrderStatusList: React.FC = async () => {
  const a = cookies() // TODO: 無理やり動的にしないと親のrefreshで更新しない。要追加調査。
  const result = await getClient().query(
    ListAllOrdersByUserQuery,
    { UserID: "user_987654321" },
    {
      pause: false,
      requestPolicy: 'network-only',
    }
  );
  // const subRes  = useSubscription({ query: newMessages }, handleSubscription);

  return (
    <section
      className="
        flex flex-col
        max-h-52 md:max-h-screen w-full overflow-hidden
      "
    >
      <h2 className="font-semibold text-1xl py-3 px-2">
        Current Order Status graph try
        {result.data?.getOrdersByUserID?.length}
      </h2>
      <ul>
        {result.data?.getOrdersByUserID?.map((item) => (
          <li key={item?.OrderDateTime}>{item?.OrderDateTime}{item?.Status}{item?.UserID}{item?.OrderTransaction}</li>
        ))}
        </ul>
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col space-y-4">
          {ORDERS.map((order: Order, index: number) => (
            <OrderStateItem key={index} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
};
