import { graphql } from '@/gql';

export const ListAllOrdersByUserQuery = graphql(`
  query ListAllOrdersByUser ($UserID: ID!) {
    getOrdersByUserID(UserID: $UserID) {
      OrderDateTime
      OrderTransaction
      Status
      UserID
    }
  }
`)

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
