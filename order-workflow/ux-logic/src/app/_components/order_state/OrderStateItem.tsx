import React from 'react';

import { Order } from './models';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/app/_components/ui/card"


export const OrderStateItem: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <Card className="w-full max-w-xs p-2">
      <CardHeader>
        <CardTitle>{order.drink.type}</CardTitle>
        <CardDescription>{formatDate(order.datetime)}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center gap-1">
          <PackageIcon className="h-4 w-4 text-green-500" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">Processing</span>
          </div>
        </div>
        <div className="border-t pt-2">
          <div className="mt-1">
            <span className="font-medium text-sm text-gray-600">{sizeMapper(order.drink.size)} - ¥{order.drink.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PackageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function sizeMapper(size: 's' | 'm' | 'l' | '-'): 'Small' | 'Medium' | 'Large' | '-' {
  switch (size) {
      case 's':
          return 'Small';
      case 'm':
          return 'Medium';
      case 'l':
          return 'Large';
      case '-':
          return '-';
      default:
          throw new Error('Invalid size');
  }
}

function formatDate(date: "-" | Date): string {
  if (date === '-') {
      return '-';
  }
  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
  };
  const formattedDate = date.toLocaleDateString('en-US', options);

  return `Placed on ${formattedDate}`;
}
