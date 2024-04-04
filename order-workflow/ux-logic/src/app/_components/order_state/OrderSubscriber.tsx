'use client'

import React from 'react';
import { useSubscription } from '@urql/next';


const handleSubscription = (messages = [], response: any) => {
  return [response.newMessages, ...messages];
};

type Props = {
  children: React.ReactNode,
}
export const CoffeeItem: React.FC<Props> = ({ children }) => {
   //const [res] = useSubscription({ query: newMessages }, handleSubscription);

  return (
    <>
    {/*
      <ul>
        {res.data.map(message => (
          <p key={message.id}>
            {message.from}: "{message.text}"
          </p>
        ))}
      </ul>
        {children} */}
    </>
  );
};
