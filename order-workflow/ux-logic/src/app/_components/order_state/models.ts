/* modeling */
type DrinkType = "Esspresso" | "Latte" | "Tea" | "-"
type Drink = {
  type: DrinkType;
  size: "s" | "m" | "l" | "-";
  price: string;
}
type OrderState = "Pending" | "Preparing" | "Ready" | "Failed" | "Canceled" | "Delivered" | "New"
export type Order =  {
  drink: Drink;
  state: OrderState;
  datetime: Date | "-";
}
export type AcceptedOrder = Order & { orderID: string; };

/* conversion with the external world */
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const OrderStateSchema = z.enum(["Pending", "Preparing", "Ready", "Failed", "Canceled", "Delivered", "New"]);
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

const a = [
  {
    UserID: 'user_987654321',
    OrderID: 'user_9876543212024-03-23T13:54:33.830Z',
    OrderItem: '{"item":"Latte","size":"l","price":"780"}',
    Status: 'Pending',
    __typename: 'OrderStateView'
  }
]

const FetchedOrderSchema = z.array(z.object({
  UserID: z.string(),
  OrderID: z.string(),
  Datetime: z.string().transform((str) => str === "-" ? "-" : new Date(str)),
  OrderItem: OrderItemSchema,
  Status: OrderStateSchema,
}));

export const transformAndValidateOrders = (data: unknown): AcceptedOrder[] => {
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

    const datetmp =  "-" // tmp

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
