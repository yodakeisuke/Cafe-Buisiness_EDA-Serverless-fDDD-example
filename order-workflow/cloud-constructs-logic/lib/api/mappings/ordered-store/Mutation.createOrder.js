export function request(ctx) {
  return {
      version: "2018-05-29",
      operation: "PutItem",
      key: {
          "UserID": util.dynamodb.toDynamoDB(ctx.args.input.UserID),
          "OrderDateTime": util.dynamodb.toDynamoDB(ctx.args.input.OrderDateTime)
      },
      attributeValues: {
          "Status": util.dynamodb.toDynamoDB(ctx.args.input.Status),
          "OrderTransaction": util.dynamodb.toDynamoDB(ctx.args.input.OrderTransaction)
      }
  };
}

export function response(ctx) {
  return {
      UserID: ctx.result.UserID,
      OrderDateTime: ctx.result.OrderDateTime,
      Status: ctx.result.Status,
      OrderTransaction: ctx.result.OrderTransaction
  };
}
