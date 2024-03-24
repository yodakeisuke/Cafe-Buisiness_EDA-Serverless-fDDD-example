export function request(ctx) {
  return {
      version: "2018-05-29",
      operation: "Query",
      query: {
        expression: 'UserID = :userid',
        expressionValues: util.dynamodb.toMapValues({ ':userid': ctx.args.UserID }),
      }
  };
}

export function response(ctx) {
  if (!ctx.result.items) {
      console.error("No items found.");
      return [];
  }
  return ctx.result.items.map(item => ({
      UserID: item.UserID,
      OrderID: item.OrderID,
      Datetime: item.Datetime,
      OrderItem: item.OrderItem,
      Status: item.Status,
  }));
}
