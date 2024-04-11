import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import fetch from "node-fetch";
import { URL } from "url";

const mutation = `mutation UpdateOrderStateView($input: UpdateOrderStateViewInput!) {
    updateOrderStateView(input: $input) {
        UserID
        OrderID
        Status
    }
}`;

export const handler = async (event) => {
    console.log(`REQUEST++++${JSON.stringify(event)}`);

    const AppSyncConfig = {
        aws_appsync_graphqlEndpoint: process.env.APPSYNC_ENDPOINT_URL || "",
        region: process.env.AWS_REGION || ""
    };

    const url = new URL(AppSyncConfig.aws_appsync_graphqlEndpoint);
    const signer = new SignatureV4({
        service: 'appsync',
        region: AppSyncConfig.region,
        credentials: defaultProvider(),
        sha256: Sha256
    });

    const { UserID, OrderID, Status } = event.detail;

    const request = new HttpRequest({
        hostname: url.hostname,
        method: 'POST',
        path: url.pathname,
        headers: {
            'Content-Type': 'application/json',
            'host': url.hostname,
        },
        body: JSON.stringify({
            operationName: "UpdateOrderStateView",
            query: mutation,
            variables: {
                input: { UserID, OrderID, Status }
            }
        })
    });
    console.log("UserID", UserID, "OrderID", OrderID, "Status", Status);

    const signedRequest = await signer.sign(request);

    try {
        const response = await fetch(AppSyncConfig.aws_appsync_graphqlEndpoint, {
            method: signedRequest.method,
            headers: signedRequest.headers,
            body: signedRequest.body,
        });

        const data = await response.json();
        console.log('Mutation result:', data);
    } catch (error) {
        console.error('Error executing mutation:', error);
    }
};
