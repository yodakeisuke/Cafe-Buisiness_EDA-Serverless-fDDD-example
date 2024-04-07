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

export const onUpdateOrderStateViewByUser = graphql(`
  subscription onUpdateOrderStateView($userID: String!) {
    onUpdateOrderStateView(UserID: $userID) {
      OrderID
      UserID
      Status
    }
  }
`);
