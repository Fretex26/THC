import { HttpStatus } from "@nestjs/common";
import { USER_ERROR_CODES } from "src/users/domain/errors/user.error-codes";

const ERROR_BY_CODE: Record<string, number> = {
    [USER_ERROR_CODES.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [USER_ERROR_CODES.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [USER_ERROR_CODES.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED
}

export class ErrorHttpMapper {
    static toHttpStatusCode(errorCode: string): number {
        return ERROR_BY_CODE[errorCode] || HttpStatus.INTERNAL_SERVER_ERROR
    }

    static toHttpStatusLabel(statusCode: number): string {
        const labels: Record<number, string> = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            409: 'Conflict',
            500: 'Internal Server Error'
        }
        return labels[statusCode] || 'Internal Server Error'
    }
}