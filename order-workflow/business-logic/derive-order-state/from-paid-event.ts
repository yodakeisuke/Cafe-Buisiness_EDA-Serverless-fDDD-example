import { EventBridgeEvent } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({});

export async function handler(event: EventBridgeEvent<'Paid', any>) {
    const dynamoRecord = event.detail.dynamodb;
    console.log('consume ordered event to drive read model', JSON.stringify(dynamoRecord, null, 4));

    const userId = dynamoRecord.NewImage.UserID.S;
    const orderID = dynamoRecord.NewImage.OrderID.S;

    const stateAfterPayment = dynamoRecord.NewImage.ChargeResult.S === 'Fullfilled' ? 'Paid' : 'Failed';

    const tableName = process.env.TABLE_NAME || '';

    const params = {
        TableName: tableName,
        Key: {
            "UserID": { S: userId },
            "OrderID": { S: dynamoRecord.NewImage.OrderID.S }
        },
        UpdateExpression: "set #Status = :status",
        ExpressionAttributeNames: {
            "#Status": "Status"
        },
        ExpressionAttributeValues: {
            ":status": { S: stateAfterPayment }
        }
    };

    try {
        const result = await dynamoDbClient.send(new UpdateItemCommand(params));
        console.log('Upsert result', result);
    } catch (error) {
        console.error('Error upserting data into DynamoDB', error);
        throw new Error('Error upserting data into DynamoDB');
    }
}
