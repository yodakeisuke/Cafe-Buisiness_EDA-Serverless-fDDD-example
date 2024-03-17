'use client';

import React from 'react';

export const OrderButton: React.FC = () => {
  return (
    <button
      className="
        bg-amber-700 hover:bg-amber-800
        text-white font-bold text-sm
        py-1 px-3 rounded
      "
    >
      Order<br />Now
  </button>
  );
};
