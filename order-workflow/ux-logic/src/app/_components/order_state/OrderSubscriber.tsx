'use client'

import React, { useEffect, useState } from 'react';
import { Client } from 'aws-amplify/api';

import { onUpdateOrderStateViewByUser } from '@/lib/query';

// 更新されるデータの型を定義
interface OrderStateView {
  OrderID: string;
  UserID: string;
  Status: string;
}

interface OrderUpdateSubscriberProps {
  client: Client
  children: React.ReactNode
}

const OrderUpdateSubscriber: React.FC<OrderUpdateSubscriberProps> = ({ client, children }) => {
  const [orderStateView, setOrderStateView] = useState<OrderStateView | null>(null);

  useEffect(() => {
    const updatesub = client.graphql({
      query: onUpdateOrderStateViewByUser,
      variables: {
        "userID": "user_987654321"
      }
      // @ts-ignore
    })?.subscribe({
      next: (data :any) => {
        console.log('data: ', data);
        setOrderStateView(data.data.onUpdateOrderStateView);
      }
    });

    return () => updatesub.unsubscribe();
  }, [client]);

  return (
    <div>
      {children}
      <div className="absolute top-16">
        <h2>Order State View Updated</h2>
        <p>Order ID: {orderStateView?.OrderID}</p>
        <p>User ID: {orderStateView?.UserID}</p>
        <p>Status: {orderStateView?.Status}</p>
      </div>
    </div>
  );
};

export default OrderUpdateSubscriber;
