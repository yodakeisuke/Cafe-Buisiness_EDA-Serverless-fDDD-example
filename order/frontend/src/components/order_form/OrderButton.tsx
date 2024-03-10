import React from 'react';


export const OrderButton: React.FC = () => {
  return (
    <button
      className="
        bg-amber-700 hover:bg-amber-800
        text-white font-bold
        py-1 px-2 rounded
      "
    >
      Order<br />Now
  </button>
  );
};
