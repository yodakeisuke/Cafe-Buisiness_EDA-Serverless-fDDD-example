'use client'

import React from 'react';
import Image from 'next/image';
import { AspectRatio } from "@/components/ui/aspect-ratio"

import { SizePrice } from './static_data';

import { SizeToggle } from './SizeToggle';
import { OrderButton } from './OrderButton';
import { useSizePrice } from './useSizePrice';

interface CoffeeItemProps {
  image: string;
  title: string;
  sizes: SizePrice[];
}

export const CoffeeItem: React.FC<CoffeeItemProps> = ({ image, title, sizes }) => {
  const { price, setSize } = useSizePrice(sizes);

  const sizeProps = {
    s: sizes.some(s => s.size === 's'),
    m: sizes.some(s => s.size === 'm'),
    l: sizes.some(s => s.size === 'l'),
  };

  return (
    <div
      className="
        grid gap-4
        grid-cols-[29%,1fr,auto]
        items-center
      "
    >

      <div className="h-full">
        <CoffeeImage src={image} alt={title} />
      </div>

      <div
        className="
          h-full
          grid items-between
        "
      >
        <h3 className="font-bold text-xl">{title}</h3>
        <SizeToggle onChange={setSize}{...sizeProps}/>
      </div>

      <div
        className="
          h-full
          grid items-start
          gap-1
        "
      >
        <div className="font-semibold text-lg text-gray-500">
          ¥ {price}
        </div>
        <OrderButton />
      </div>

    </div>
  );
};

interface CoffeeImageProps {
  src: string;
  alt: string;
}

const CoffeeImage: React.FC<CoffeeImageProps> = ({ src, alt }) => {
  return (
    <div className='relative w-full h-full'>
      <AspectRatio ratio={1 / 1}>
        <Image
          src={src}
          alt={alt}
          fill
          style={{objectFit: "cover"}}
        />
      </AspectRatio>
    </div>
  );
};
