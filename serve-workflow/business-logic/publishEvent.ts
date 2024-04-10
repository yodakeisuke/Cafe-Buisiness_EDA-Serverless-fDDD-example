import { EventBridgeEvent } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';

const eventBridge = new EventBridge();

export async function handler(event: EventBridgeEvent<'Paid', any>) {
    const originalInput = event.detail.dynamodb.NewImage;
    console.log('consume approved paid event to push event', JSON.stringify(originalInput, null, 4));

    const userData = {
        UserID: originalInput.UserID.S,
        OrderID: originalInput.OrderID.S,
        Status: "Ready",
        ReadyDateTime: new Date().toISOString(),
    };

    await eventBridge.putEvents({
        Entries: [{
            Source: 'cafe.serve',
            DetailType: 'Prepared',
            Detail: JSON.stringify(userData),
            EventBusName: 'cafe-business-central-bus',
        }]
    }).promise();

    return userData;
};
