import React from 'react';

import { ORDER_ITEMS } from './models';
import { CoffeeItem } from './CoffeeItem';


export const OrderForm = () => {
  return (
    <div className='grid gap-8'>
    <h1 className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-800 to-warm-gray-900">
      Drinks
    </h1>
      <p className="text-gray-500 dark:text-gray-400 -mt-5">
        Comforting classics for any time of day
      </p>
      {ORDER_ITEMS.map((item, index) => (
        <CoffeeItem
          key={index}
          image={item.imagePath}
          title={item.itemName}
          sizes={item.availableSizes}
        />
      ))}
    </div>
  );
};
