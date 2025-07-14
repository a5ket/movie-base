import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config/consts'


export interface TokenPayload {
    userId: number
    email: string
    iat?: number
    exp?: number
}


export function createToken(payload: Omit<TokenPayload, 'iat' | 'exp'>, expiresIn: number = 60 * 60 * 24 * 7) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn })
}


export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload
    } catch (err) {
        throw new Error('Invalid or expired token')
    }
}
