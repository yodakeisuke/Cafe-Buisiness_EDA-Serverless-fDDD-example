/* modeling */
type DrinkType = "Esspresso" | "Latte" | "Tea" | "-"
type Drink = {
  type: DrinkType;
  size: "s" | "m" | "l" | "-";
  price: string;
}
type OrderState = "Pending" | "Paid" | "Preparing" | "Ready" | "Failed" | "Canceled" | "Delivered"
export type Order =  {
  drink: Drink;
  state: OrderState;
  datetime: Date | "-";
}
export type AcceptedOrder = Order & { orderID: string; };

/* conversion with the external world */
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// TODO: これの列挙共通化
const OrderStateSchema = z.enum(["Pending", "Paid", "Preparing", "Ready", "Failed", "Canceled", "Delivered"]);
const DrinkTypeSchema = z.enum(["Esspresso", "Latte", "Tea", "-"]);
const DrinkSchema = z.object({
  type: DrinkTypeSchema,
  size: z.enum(["s", "m", "l", "-"]),
  price: z.string(),
});
const AcceptedOrderSchema = z.object({
  orderID: z.string(),
  drink: DrinkSchema,
  state: OrderStateSchema,
  datetime: z.date(),
});

const OrderItemSchema = z.string().transform((str) => {
  const json = JSON.parse(str);
  return DrinkSchema.parse({ type: json.item, size: json.size, price: json.price });
});

const FetchedOrderSchema = z.array(z.object({
  UserID: z.string(),
  OrderID: z.string(),
  Datetime: z.string().transform((str) => str === "-" ? "-" : new Date(str)),
  OrderItem: OrderItemSchema,
  Status: OrderStateSchema,
}));

export const transformAndValidateOrders = (data: unknown): AcceptedOrder[] => {
  console.log("data", data)
  const parsedData = FetchedOrderSchema.parse(data) || [];

  return parsedData.map((order) => {
    if (!order) {
      return {
        orderID: uuidv4(),
        drink: { type: "-", size: "-", price: "-" },
        state: "Failed",
        datetime: "-",
      };
    }

    console.log("-------------")
    console.log(order)

    const orderedItem = {
      orderID: order.OrderID,
      drink: {
        type: order.OrderItem.type,
        size: order.OrderItem.size,
        price: order.OrderItem.price,
      },
      state: order.Status,
      datetime: order.Datetime,
    };

    return AcceptedOrderSchema.parse(orderedItem);
  });
};
