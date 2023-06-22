export const ALLOWED_OPERATIONS = ['add', 'subtract', 'multiply', 'divide'] as const;

export type AllowedOperation = typeof ALLOWED_OPERATIONS[number];

export interface NormalizedPathParameters {
    operation: AllowedOperation,
    operand1: number,
    operand2: number
}