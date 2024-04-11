import fetch from 'node-fetch';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export const handler = async (event) => {
    console.log("call slack with:", event);

    const orderInfo = event.input.detail.dynamodb;
    console.log('orderInfo: ', orderInfo)

    // get the webhook URL from Secrets Manager
    const secretArn = process.env.SECRET_ARN;
    const client = new SecretsManagerClient({});
    const command = new GetSecretValueCommand({ SecretId: secretArn });
    const secretData = await client.send(command);
    const secretObj = JSON.parse(secretData.SecretString || "");
    const webhookUrl = secretObj['slack-webhook-url'];
    console.log('webhookUrl: ', webhookUrl);

    const taskToken = event.taskToken;

    const message = {
        text: `新しい注文があります: ${orderInfo.NewImage.OrderID.S}`,
        attachments: [
            {
                fallback: "提供準備が完了したらボタンを押してください",
                callback_id: "approval_request",
                color: "#3AA3E3",
                attachment_type: "default",
                actions: [
                    {
                        name: "approve",
                        text: "準備完了",
                        type: "button",
                        value: taskToken
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Webhook sent successfully');
        return {
            statusCode: 200,
            body: 'Webhook sent successfully'
        };
    } catch (error) {
        console.error('Error sending webhook:', error);
        return { statusCode: 500, body: 'Failed to send webhook' };
    }
};
