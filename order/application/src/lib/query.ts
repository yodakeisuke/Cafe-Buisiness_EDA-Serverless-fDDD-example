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
