import { DomainError } from "src/common/domain/domain.error"
import { USER_ERROR_CODES } from "./user.error-codes"

export class UserAlreadyExistsError extends DomainError {
    readonly code = USER_ERROR_CODES.ALREADY_EXISTS

    constructor(email: string) {
        super(`User with email ${email} already exists`)
    }
}

export class UserNotFoundError extends DomainError {
    readonly code = USER_ERROR_CODES.NOT_FOUND

    constructor(email: string) {
        super(`User with email ${email} not found`)
    }
}

export class UserInvalidCredentialsError extends DomainError {
    readonly code = USER_ERROR_CODES.INVALID_CREDENTIALS
    
    constructor() {
        super('Please, verify your credentials')
    }
}