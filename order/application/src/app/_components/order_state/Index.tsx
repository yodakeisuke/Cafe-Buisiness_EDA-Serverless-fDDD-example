'use client';

import React from 'react';
import { Suspense } from 'react';
import { useQuery, gql } from '@urql/next';

import { ScrollArea } from "@/app/_components/ui/scroll-area"

import { ORDERS, Order } from './models';
import { OrderStateItem } from './OrderStateItem';

export const OrderStatus = ()  => {
  return (
    <Suspense>
      <OrderStatusList />
    </Suspense>
  );
}

export const OrderStatusList: React.FC = async () => {
  // const [result] = useQuery<OrderListResponse>({
  //  query: GET_ORDER_LIST_QUERY,
  //  variables: { UserID: "user-123" },
  // });

  return (
    <section
      className="
        flex flex-col
        max-h-52 md:max-h-screen w-full overflow-hidden
      "
    >
      <h2 className="font-semibold text-1xl py-3 px-2">
        Current Order Status graph try
      </h2>
      {/* <ul>
        {result.data?.listOrders.items.map(item => (
          <li key={item.OrderDateTime}>{item.Status}{item.UserID}</li>
        ))}
        </ul> */}
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
