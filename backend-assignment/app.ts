import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

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
}

const isValidOperand = (operand: string | undefined): operand is string => {
    return !!operand && !isNaN(+operand);
}

const performOperation = (operation: ALLOWED_OPERATION, operand1: number, operand2: number): number => {
    switch(operation) {
        case 'add':
            return operand1 + operand2;
        case 'subtract':
            return operand1 - operand2;
        case 'multiply': 
            return operand1 * operand2; // maybe use BigInt for such operations?
        case 'divide':
            return operand1 / operand2;
    }
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const {operation, operand1, operand2} = event.pathParameters || {};

    if(!isAllowedOperation(operation)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Invalid operation: ${operation}`,
            }),
        }
    }

    if(!isValidOperand(operand1)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Invalid first operand: ${operand1}`,
            })
        }
    }

    if(!isValidOperand(operand2)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Invalid second operand: ${operand2}`,
            })
        }
    }

    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                result: performOperation(operation, +operand1, +operand2)
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Server error',
            }),
        };
    }
};
