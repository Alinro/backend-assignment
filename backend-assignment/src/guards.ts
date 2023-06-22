import { AllowedOperation, ALLOWED_OPERATIONS } from "./types";

export const isAllowedOperation = (operation: string | undefined): operation is AllowedOperation => {
    return !!operation && ALLOWED_OPERATIONS.includes(operation as AllowedOperation);
};

export const isValidOperand = (operand: string | undefined): operand is string => {
    return !!operand && !isNaN(+operand);
};