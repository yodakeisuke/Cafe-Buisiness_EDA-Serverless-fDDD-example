'use client';

import React from 'react';
import { useRouter } from 'next/navigation'

import { CreateOrderMutation } from '@/lib/query';
import { useMutation } from '@urql/next';

import { Button } from "@/components/ui/button"

interface OrderProps {
  item: string;
  price: string;
  size: string | null;
}

export const OrderButton: React.FC<OrderProps> = (props) => {
  return (
    <React.Suspense>
      <ButtonInner {...props} />
    </React.Suspense>
  );
};

const USER_ID = "user_987654321";

const ButtonInner: React.FC<OrderProps> = (props) => {
  const [createOrderResult, createOrder] = useMutation(CreateOrderMutation);
  const router = useRouter()

  const handleClick = () => {
    const now = new Date().toISOString();
    createOrder({
      input: {
        OrderDateTime: now,
        OrderTransaction: JSON.stringify({
          transactionID: USER_ID + now,
          userID: USER_ID,
          item: props.item,
          price: props.price,
          size: props.size,
        }),
        Status: "Pending",
        UserID: USER_ID,
      },
    });
    // TODO: すごい微妙 subscribeにする。
    setTimeout(() => {
      router.refresh();
    }, 500);
  }

  return (
    <Button
      className="
        bg-amber-700 hover:bg-amber-800
        text-white font-bold text-sm
        py-1 px-3 rounded
      "
      onClick={handleClick}
      disabled={!(props.size)}
    >
      Order<br />Now
  </Button>
  );
};
