import { gql } from 'urql';

export const GET_ORDER_QUERY = gql`
  query getOrder($orderDateTime: AWSDateTime!, $userID: ID!) {
    getOrder(OrderDateTime: $orderDateTime, UserID: $userID) {
      UserID
      OrderDateTime
      Status
      OrderTransaction
    }
  }
`;

export const GET_ORDER_LIST_QUERY = gql`
  query ListOrders($userID: ID!) {
    listOrders(filter: { UserID: { eq: $userID } }) {
      items {
        UserID
        OrderDateTime
        Status
        OrderTransaction
      }
    }
  }
`;

export type OrderItem = {
  UserID: string;
  OrderDateTime: string;
  Status: string;
  OrderTransaction: any;
};

export type OrderListResponse = {
  listOrders: {
    items: OrderItem[];
    nextToken?: string;
  };
};
