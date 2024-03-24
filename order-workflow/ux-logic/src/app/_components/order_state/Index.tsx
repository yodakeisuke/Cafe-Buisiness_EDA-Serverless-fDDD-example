import React from 'react';
import { Suspense } from 'react';
import { cookies } from 'next/headers';

import { useSubscription } from '@urql/next';
import { registerUrql } from '@urql/next/rsc';
import { serverSideClient } from '@/lib/dataAccessClient/serverSide';
import { ListAllOrdersByUserQuery } from '@/lib/query';

import { ScrollArea } from "@/app/_components/ui/scroll-area"

import { Order, transformAndValidateOrders } from './models';
import { OrderStateItem } from './OrderStateItem';


const { getClient } = registerUrql(serverSideClient);

const handleSubscription = (messages = [], response: any) => {
  return [response.newMessages, ...messages];
};

export const OrderStatus = ()  => {
  return (
    <Suspense>
      <ScrollArea>
        <OrderStatusList />
      </ScrollArea>
    </Suspense>
  );
}
// TODO: cache refresh
export const OrderStatusList: React.FC = async () => {
  const placeholder = cookies() // TODO: 無理やり動的にしないと親のrefreshで更新しない。要追加調査。
  const orderListResult = await getClient().query(
    ListAllOrdersByUserQuery,
    { UserID: "user_987654321" },
    {
      pause: false,
      requestPolicy: 'network-only',
    }
  );
  const data = orderListResult.data?.getOrdersByUserID
  const orders = transformAndValidateOrders(data);

  // const subRes  = useSubscription({ query: newMessages }, handleSubscription);

  return (
    <section
      className="
        flex flex-col
        max-h-52 md:max-h-screen w-full overflow-hidden
      "
    >
      <h2 className="text-1xl py-3 px-1 font-bold text-gray-800 dark:text-gray-200">
        Current Order Status
      </h2>
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col space-y-4">
          {orders.map( order => (
            <OrderStateItem
              key={order.orderID}
              order={{
                drink: order.drink,
                state: order.state,
                datetime: order.datetime,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
