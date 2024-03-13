type OrderState = "Pending" | "Preparing" | "Ready" | "Failed" | "Canceled" | "Delivered"
type DrinkType = "Esspresso" | "Latte" | "Tea"
type Drink = {
  type: DrinkType;
  size: "s" | "m" | "l";
}
export type Order =  {
  state: OrderState;
  coffe: Drink;
}

export const ORDERS: Order[] = [
  {
    state: "Preparing",
    coffe: {
      type: "Esspresso",
      size: "m",
    },
  },
  {
    state: "Ready",
    coffe: {
      type: "Tea",
      size: "s",
    },
  },
  {
    state: "Delivered",
    coffe: {
      type: "Tea",
      size: "m",
    },
  },
];
