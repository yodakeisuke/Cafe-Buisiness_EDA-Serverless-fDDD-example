import { registerUrql } from '@urql/next/rsc';
import { makeClient } from '@/lib/client';

import { GET_ORDER_LIST_QUERY, OrderListResponse } from '@/lib/query';

import { OrderForm } from "@/app/_components/order_form/Index";
import { OrderStatus } from "@/app/_components/order_state/Index";


const { getClient } = registerUrql(makeClient);

export default async function Home() {
  const result = await getClient().query<OrderListResponse>(GET_ORDER_LIST_QUERY, { UserID: "user-123" });
  console.log("server result", result);
  return (
    <main
      className="
        h-screen
        place-items-center
        w-[95vw] max-w-[700px] mx-auto
        grid
        grid-rows-[1fr_min-content] md:grid-cols-[60%_40%] md:grid-rows-none
        gap-1
      "
    >
      <ContentArea className="grid place-items-center row-span-1">
        <OrderForm />
      </ContentArea>
      <ContentArea className="row-span-auto">
        <OrderStatus />
      </ContentArea>
    </main>
  );
}


interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      grid row-span-1
      place-items-center
      h-full w-full max-h-[98vh]
      bg-white drop-shadow-sm border-1 border-gray-200 rounded-sm
      ${className}
    `}>
      {children}
    </div>
  );
};
