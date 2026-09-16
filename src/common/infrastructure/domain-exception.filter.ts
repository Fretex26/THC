import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { DomainError } from "../domain/domain.error";
import { ErrorHttpMapper } from "./error-http.mapper";
import { Response } from "express";

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainError, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const statusCode = ErrorHttpMapper.toHttpStatusCode(exception.code)
        
        response.status(statusCode).json({
            statusCode,
            code: exception.code,
            message: exception.message,
            error: ErrorHttpMapper.toHttpStatusLabel(statusCode),
            timestamp: new Date().toISOString()
        })
    }
}