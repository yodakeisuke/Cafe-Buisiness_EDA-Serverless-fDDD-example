import React, { useState } from 'react';

import { SizePrice } from './models';


export const  useSizePrice = (initialSizes: SizePrice[]) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);

  const setSize = (size: string) => {
    setSelectedSize(size);
    const sizePrice = initialSizes.find(sizePrice => sizePrice.size === size);
    if (sizePrice) {
      setPrice(sizePrice.price);
    } else {
      setPrice(0);
    }
  };

  return { price, setSize };
}
