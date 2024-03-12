import React from 'react';

import { Order } from './models';


export const OrderStateItem: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <div className="p-4 shadow rounded bg-white">
      <h2 className="text-lg font-bold">State: {order.state}</h2>
      <p>Type: {order.coffe.type}</p>
      <p>Size: {order.coffe.size.toUpperCase()}</p>
    </div>
  );
};
