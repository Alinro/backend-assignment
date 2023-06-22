import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from 'aws-lambda';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const ALLOWED_OPERATIONS = ['add', 'subtract', 'multiply', 'divide'] as const;
export type ALLOWED_OPERATION = typeof ALLOWED_OPERATIONS[number];

const isAllowedOperation = (operation: string | undefined): operation is ALLOWED_OPERATION => {
    return !!operation && ALLOWED_OPERATIONS.includes(operation as ALLOWED_OPERATION);
};

const isValidOperand = (operand: string | undefined): operand is string => {
    return !!operand && !isNaN(+operand);
};

const performOperation = (operation: ALLOWED_OPERATION, operand1: number, operand2: number): number => {
    switch (operation) {
        case 'add':
            return operand1 + operand2;
        case 'subtract':
            return operand1 - operand2;
        case 'multiply':
            return operand1 * operand2; // maybe use BigInt for such operations?
        case 'divide':
            return operand1 / operand2;
    }
};

interface NormalizedPathParameters {
    operation: ALLOWED_OPERATION,
    operand1: number,
    operand2: number
}

class CustomError extends Error {
    constructor(message: string) {
        super(message);
    }
}

const normalizePathParameters = (parameters: APIGatewayProxyEventPathParameters | null): NormalizedPathParameters => {
    const { operation, operand1, operand2 } = parameters || {};

    if (!isAllowedOperation(operation)) {
        throw new CustomError(`Invalid operation: ${operation}`);
    }

    if (!isValidOperand(operand1)) {
        throw new CustomError(`Invalid first operand: ${operand1}`);
    }

    if (!isValidOperand(operand2)) {
        throw new CustomError(`Invalid second operand: ${operand2}`);
    }

    return {
        operation,
        operand1: +operand1,
        operand2: +operand2
    };
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { operation, operand1, operand2 } = normalizePathParameters(event.pathParameters);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: performOperation(operation, +operand1, +operand2),
            }),
        };
    } catch (err) {
        if (err instanceof CustomError) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: err.message,
                }),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Server error'
                }),
            };
        }

    }
};
