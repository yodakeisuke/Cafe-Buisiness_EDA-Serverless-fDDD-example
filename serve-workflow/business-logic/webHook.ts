import fetch from 'node-fetch';

const webhookUrl = 'https://hooks.slack.com/services/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';

export const handler = async (event: any) => {
    console.log("call webhook lambda input event:", event)
    const message = {
        "text": "新しい承認リクエストがあります。",
        "attachments": [
            {
                "text": "リクエストを承認してください。",
                "callback_id": "request_approval",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "action",
                        "text": "承認",
                        "type": "button",
                        "value": "approve"
                    }
                ]
            }
        ]
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return {
            statusCode: 200,
            body: 'Webhook sent successfully'
        };
    } catch (error) {
        console.error('Error sending webhook:', error);
        return {
            statusCode: 500,
            body: 'Failed to send webhook'
        };
    }
};
