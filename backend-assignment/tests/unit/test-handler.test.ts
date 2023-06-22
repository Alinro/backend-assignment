import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../app';
import { expect, describe, it } from '@jest/globals';

const baseEvent: APIGatewayProxyEvent = {
    httpMethod: 'get',
    body: '',
    headers: {},
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: '/arithmetic-operation',
    pathParameters: {},
    queryStringParameters: {},
    requestContext: {
        accountId: '123456789012',
        apiId: '1234',
        authorizer: {},
        httpMethod: 'get',
        identity: {
            accessKey: '',
            accountId: '',
            apiKey: '',
            apiKeyId: '',
            caller: '',
            clientCert: {
                clientCertPem: '',
                issuerDN: '',
                serialNumber: '',
                subjectDN: '',
                validity: { notAfter: '', notBefore: '' },
            },
            cognitoAuthenticationProvider: '',
            cognitoAuthenticationType: '',
            cognitoIdentityId: '',
            cognitoIdentityPoolId: '',
            principalOrgId: '',
            sourceIp: '',
            user: '',
            userAgent: '',
            userArn: '',
        },
        path: '/arithmetic-operation/add/5/6',
        protocol: 'HTTP/1.1',
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        requestTimeEpoch: 1428582896000,
        resourceId: '123456',
        resourcePath: '/arithmetic-operation/add/5/6',
        stage: 'dev',
    },
    resource: '',
    stageVariables: {},
};
describe('tests for app handler', function () {
    it('returns correct response for add operation', async () => {
        const event: APIGatewayProxyEvent = {
            ...baseEvent,
            pathParameters: {
                operation: 'add',
                operand1: '5',
                operand2: '6'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 11,
            }),
        );
    });
    it('returns correct response for subtract operation', async () => {
        const event: APIGatewayProxyEvent = {
            ...baseEvent,
            pathParameters: {
                operation: 'subtract',
                operand1: '14',
                operand2: '5'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 9,
            }),
        );
    });

    it('returns correct response for multiply operation', async () => {
        const event: APIGatewayProxyEvent = {
            ...baseEvent,
            pathParameters: {
                operation: 'multiply',
                operand1: '7',
                operand2: '5'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 35,
            }),
        );
    });

    it('returns correct response for divide operation', async () => {
        const event: APIGatewayProxyEvent = {
            ...baseEvent,
            pathParameters: {
                operation: 'divide',
                operand1: '42',
                operand2: '6'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 7,
            }),
        );
    });

    it('returns bad request for invalid operation', async () => {
        const event: APIGatewayProxyEvent = {
            ...baseEvent,
            pathParameters: {
                operation: 'divid',
                operand1: '42',
                operand2: '6'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'Invalid operation: divid',
            }),
        );
    });

    it('returns bad request for invalid first operand', async () => {
        const event: APIGatewayProxyEvent = {
            ...baseEvent,
            pathParameters: {
                operation: 'divide',
                operand1: 'a42',
                operand2: '6'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'Invalid first operand: a42',
            }),
        );
    });

    it('returns bad request for invalid second operand', async () => {
        const event: APIGatewayProxyEvent = {
            ...baseEvent,
            pathParameters: {
                operation: 'divide',
                operand1: '42',
                operand2: '6b'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'Invalid second operand: 6b',
            }),
        );
    });
});
