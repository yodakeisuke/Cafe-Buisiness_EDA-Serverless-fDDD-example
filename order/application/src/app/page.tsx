import { OrderForm } from "@/app/_components/order_form/Index";
import { OrderStatus } from "@/app/_components/order_state/Index";

export default async function Home() {
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
