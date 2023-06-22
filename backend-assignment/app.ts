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

// const isValidOperand = (operand: string | ): operand is number => {
//     return true;
// }

const performOperation = (operation: ALLOWED_OPERATION, operand1: number, operand2: number): number => {
    switch(operation) {
        case 'add':
            return operand1 + operand2;
        case 'subtract':
            return operand1 - operand2;
        case 'multiply': 
            return operand1 * operand2;
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
                message: 'Invalid operation',
            }),
        }
    }

    if(!operand1 || isNaN(+operand1)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid first operand',
            })
        }
    }

    if(!operand2 || isNaN(+operand2)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid second operand',
            })
        }
    }

    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world',
                operation,
                operand1,
                operand2,
                result: performOperation(operation, +operand1, +operand2)
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
