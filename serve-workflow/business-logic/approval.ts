import { SFNClient, SendTaskSuccessCommand, SendTaskFailureCommand } from '@aws-sdk/client-sfn';
import qs from 'querystring';

const sfnClient = new SFNClient({});

export const handler = async (event: any) => {
    console.log("callback from slack:", event)

    const body = qs.parse(event.body);
    const payload = JSON.parse(body.payload);
    console.log("parsed payload:", payload)

    const actions = payload.actions[0];
    const taskToken = actions.value;
    const approved = true;

    if (!taskToken) {
        return {
            statusCode: 400,
            body: 'Missing taskToken in query parameters'
        };
    }

    try {
        if (approved) {
            const command = new SendTaskSuccessCommand({
                taskToken,
                output: JSON.stringify({ status: 'approved' })
            });
            await sfnClient.send(command);
        } else {
            const command = new SendTaskFailureCommand({
                taskToken,
                cause: 'User did not approve'
            });
            await sfnClient.send(command);
        }

        return {
            statusCode: 200,
            body: '完了を受け付けました'
        };
    } catch (error) {
        console.error('Error processing approval:', error);
        return {
            statusCode: 500,
            body: 'Failed to process approval'
        };
    }
};
