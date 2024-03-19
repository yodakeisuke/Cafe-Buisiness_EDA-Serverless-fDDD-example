import React from 'react';
import { Suspense } from 'react';

import { registerUrql } from '@urql/next/rsc';
import { makeClient } from '@/lib/client';
import { ListAllOrdersByUserQuery } from '@/lib/query';

import { ScrollArea } from "@/app/_components/ui/scroll-area"

import { ORDERS, Order } from './models';
import { OrderStateItem } from './OrderStateItem';


const { getClient } = registerUrql(makeClient);

export const OrderStatus = ()  => {
  return (
    <Suspense>
      <OrderStatusList />
    </Suspense>
  );
}
// TODO: cache refresh
export const OrderStatusList: React.FC = async () => {
  const result = await getClient().query(ListAllOrdersByUserQuery, {UserID: "user_987654321"});

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
