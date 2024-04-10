import fetch from 'node-fetch';

const webhookUrl = 'https://hooks.slack.com/services/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';

export const handler = async (event) => {
    console.log("call slack with:", event);

    const orderInfo = event.input.detail.dynamodb;
    console.log('orderInfo: ', orderInfo)

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
