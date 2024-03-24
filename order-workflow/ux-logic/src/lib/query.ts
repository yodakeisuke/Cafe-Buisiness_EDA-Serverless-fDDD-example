import { graphql } from '@/gql';

export const CreateOrderMutation = graphql(`
  mutation CreateOrder ($input: CreateOrderInput!) {
    createOrder(input: $input) {
      OrderDateTime
      OrderTransaction
      Status
      UserID
    }
  }
`)

export const ListAllOrdersByUserQuery = graphql(`
  query ListAllOrdersByUser ($UserID: ID!) {
    getOrdersByUserID(UserID: $UserID) {
      UserID
      OrderID
      OrderItem
      Status
      Datetime
    }
  }
`)


/*
subscription MySubscription {
  onCreateOrder(UserID: "user_987654321") {
    OrderDateTime
    OrderTransaction
    Status
    UserID
  }
}
*/
