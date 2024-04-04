import { EventBridgeEvent } from 'aws-lambda';

export async function handler(event: EventBridgeEvent<'Ordered', any>) {
    const orderInfo = event.detail.dynamodb;
    console.log("Lambda invoked with event:", orderInfo);

    // TODO: logic
    const userID = orderInfo.NewImage.UserID.S;
    const invoice =  {
        UserID: userID,
        OrderID: userID + orderInfo.NewImage.OrderDateTime.S,
        ChargeResult: 'Paid',
        OrderTransaction: orderInfo.NewImage.OrderTransaction.M,
    }

    console.log("Lambda returns param:", invoice);
    try {
        return {
            result: "Success",
            invoice: invoice,
        };
    } catch (error) {
        console.error('Error validating order', error);
        throw new Error('Error validating order');
    }
}
