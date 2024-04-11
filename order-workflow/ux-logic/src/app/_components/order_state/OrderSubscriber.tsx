'use client'

import React, { useEffect, useState } from 'react';
import { Client } from 'aws-amplify/api';
import { onUpdateOrderStateViewByUser } from '@/lib/query';

import { Toaster } from "@/app/_components/ui/toaster";
import { useToast } from "@/app/_components/ui/use-toast"
import { ToastAction } from "@/app/_components/ui/toast"


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
  const toast = useToast();

  useEffect(() => {
    const updatesub = client.graphql({
      query: onUpdateOrderStateViewByUser,
      variables: {
        "userID": "user_987654321"
      }
      // @ts-ignore
    })?.subscribe({
      next: (data :any) => {
        setOrderStateView(data.data.onUpdateOrderStateView);
      }
    });

    return () => updatesub.unsubscribe();
  }, [client]);

  useEffect(() => {
    if (orderStateView) {
      console.log('toast: ', orderStateView);
        toast.toast({
            duration: 10000,
            title: "Your Order Updated !",
            description: "Order ID: " + orderStateView.OrderID + "\nStatus: " + orderStateView.Status,
            action: <ToastAction altText="OK">OK</ToastAction>
        });
    }
}, [orderStateView]);

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default OrderUpdateSubscriber;
