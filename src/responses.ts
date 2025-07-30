import { Response } from 'express'
import { isValidationError } from './validation'


export function sendToken(res: Response, token: string) {
    return res
        .status(200)
        .json({ token, status: 1 })
}


export function sendData<T = unknown>(res: Response, data?: T, meta?: object) {
    return res
        .status(200)
        .json({
            data,
            meta,
            status: 1
        })
}


export function sendError(res: Response, error: string, status: number = 500) {
    return res
        .status(status)
        .json({
            error,
            status: 0
        })
}


export function sendNotFoundError(res: Response, error: string = 'Not found') {
    return sendError(res, error, 404)
}


export function sendInternalError(res: Response) {
    return sendError(res, 'Internal server error', 500)
}


export function sendValidationError(res: Response, error: unknown) {
    return res
        .status(422)
        .json({
            error: 'Invalid request',
            details: isValidationError(error) ? error.issues : undefined,
            status: 0
        })
}


export function sendUniqueError(res: Response, errorMessage: string = 'Resource already exists') {
    return res
        .status(409)
        .json({ error: errorMessage, status: 0 })
}