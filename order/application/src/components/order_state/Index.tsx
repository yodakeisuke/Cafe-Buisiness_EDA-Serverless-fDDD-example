import React from 'react';

import { ScrollArea } from "@/components/ui/scroll-area"

import { ORDERS, Order } from './models';
import { OrderStateItem } from './OrderStateItem';


export const OrderStatus: React.FC = () => {
  return (
    <section
      className="
        flex flex-col
        max-h-52 md:max-h-screen w-full overflow-hidden
      "
    >
      <h2 className="font-semibold text-1xl py-3 px-2">
        Current Order Status
      </h2>
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
