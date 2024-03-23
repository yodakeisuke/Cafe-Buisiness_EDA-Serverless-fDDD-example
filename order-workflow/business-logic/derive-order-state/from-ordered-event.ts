import { EventBridgeEvent } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({});

export async function handler(event: EventBridgeEvent<'Ordered', any>) {
    console.log('consume ordered event to drive read model', JSON.stringify(event, null, 4));

    const detail = event.detail;
    const dynamoRecord = detail.dynamodb.NewImage;

    const userId = dynamoRecord.UserID.S;
    const orderId = userId + dynamoRecord.OrderDateTime.S;

    const itemData = {
        UserID: userId as string,
        OrderID: orderId as string,
        Status: dynamoRecord.Status.S as string,
        OrderItem: {
            item: dynamoRecord.OrderTransaction.M.item.S as string,
            size: dynamoRecord.OrderTransaction.M.size.S as string,
            price: dynamoRecord.OrderTransaction.M.price.S as string,
        }
    };

    const tableName = process.env.TABLE_NAME || '';
    const params = {
        TableName: tableName,
        Key: {
            'UserID': { S: itemData.UserID },
            'OrderID': { S: itemData.OrderID }
        },
        UpdateExpression: 'SET #status = :status, OrderItem = :orderItem',
        ExpressionAttributeNames: {
            '#status': 'Status'
        },
        ExpressionAttributeValues: {
            ':status': { S: itemData.Status },
            ':orderItem': { M: {
                item: { S: itemData.OrderItem.item },
                size: { S: itemData.OrderItem.size },
                price: { S: itemData.OrderItem.price }
            }}
        },
        ReturnValues: 'UPDATED_NEW' as const
    };

    try {
        const result = await dynamoDbClient.send(new UpdateItemCommand(params));
        console.log('Upsert result', result);
    } catch (error) {
        console.error('Error upserting data into DynamoDB', error);
        throw new Error('Error upserting data into DynamoDB');
    }
}
