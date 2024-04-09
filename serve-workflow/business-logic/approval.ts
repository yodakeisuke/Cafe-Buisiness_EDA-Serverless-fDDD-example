import { SFNClient, SendTaskSuccessCommand, SendTaskFailureCommand } from '@aws-sdk/client-sfn';

const sfnClient = new SFNClient({});

export const handler = async (event: any) => {
    console.log("callback from slack:", event)
    const queryParameters = event.queryStringParameters;
    const taskToken = queryParameters?.taskToken;
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
            body: 'Approval processed'
        };
    } catch (error) {
        console.error('Error processing approval:', error);
        return {
            statusCode: 500,
            body: 'Failed to process approval'
        };
    }
};
