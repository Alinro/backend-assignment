import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { ValidationError } from "./ValidationError";
import { isAllowedOperation, isValidOperand } from "./guards";
import { AllowedOperation, NormalizedPathParameters } from "./types";

export const performOperation = (operation: AllowedOperation, operand1: number, operand2: number): number => {
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

export const normalizePathParameters = (parameters: APIGatewayProxyEventPathParameters | null): NormalizedPathParameters => {
    const { operation, operand1, operand2 } = parameters || {};

    if (!isAllowedOperation(operation)) {
        throw new ValidationError(`Invalid operation: ${operation}`);
    }

    if (!isValidOperand(operand1)) {
        throw new ValidationError(`Invalid first operand: ${operand1}`);
    }

    if (!isValidOperand(operand2)) {
        throw new ValidationError(`Invalid second operand: ${operand2}`);
    }

    return {
        operation,
        operand1: +operand1,
        operand2: +operand2
    };
}