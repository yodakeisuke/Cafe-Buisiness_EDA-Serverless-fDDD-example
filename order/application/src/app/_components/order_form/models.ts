export interface SizePrice {
  size: string;
  price: number;
}

interface Item {
  imagePath: string;
  itemName: string;
  availableSizes: SizePrice[];
}

export const ORDER_ITEMS: Item[] = [
  {
    imagePath: "/product_photo/espresso.webp",
    itemName: "Esspresso",
    availableSizes: [
      { size: "s", price: 400 },
      { size: "m", price: 580 },
    ]
  },
  {
    imagePath: "/product_photo/latte.webp",
    itemName: "Latte",
    availableSizes: [
      { size: "s", price: 500 },
      { size: "m", price: 650 },
      { size: "l", price: 780 },
    ],
  },
  {
    imagePath: "/product_photo/tea.webp",
    itemName: "Tea",
    availableSizes: [
      { size: "s", price: 350 },
      { size: "m", price: 400 },
      { size: "l", price: 450 },
    ],
  } ,
];


const a = ORDER_ITEMS[0].availableSizes[0].size.includes("s")
