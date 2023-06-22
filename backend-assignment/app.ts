import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ValidationError } from './src/ValidationError';
import { normalizePathParameters, performOperation } from './src/operation';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

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
        if (err instanceof ValidationError) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: err.message,
                }),
            };
        } else {
            console.error(err);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Server error'
                }),
            };
        }

    }
};
